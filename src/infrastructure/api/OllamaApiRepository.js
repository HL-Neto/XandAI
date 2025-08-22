import { OllamaRepository } from '../../domain/repositories/OllamaRepository.js';
import { OllamaModel } from '../../domain/entities/OllamaModel.js';
import { OllamaConfig } from '../../domain/entities/OllamaConfig.js';

/**
 * Implementação da API do OLLAMA
 * @class OllamaApiRepository
 * @extends {OllamaRepository}
 */
export class OllamaApiRepository extends OllamaRepository {
  constructor() {
    super();
    this.config = OllamaConfig.createDefault();
    this.loadConfig();
  }

  /**
   * Carrega a configuração do localStorage
   */
  loadConfig() {
    try {
      const savedConfig = localStorage.getItem('ollama-config');
      if (savedConfig) {
        const configData = JSON.parse(savedConfig);
        this.config = OllamaConfig.fromObject(configData);
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração do OLLAMA:', error);
    }
  }

  /**
   * Força recarregamento da configuração
   */
  reloadConfig() {
    this.loadConfig();
  }

  /**
   * Envia uma mensagem para o OLLAMA
   * @param {string} message - Mensagem para enviar
   * @param {string} model - Modelo a ser usado (opcional, usa o configurado)
   * @param {Object} options - Opções adicionais
   * @param {Function} onToken - Callback para receber tokens em tempo real
   * @returns {Promise<string>} - Resposta completa do modelo
   */
  async sendMessage(message, model = null, options = {}, onToken = null) {
    // Sempre recarrega a configuração para garantir que está atualizada
    this.reloadConfig();

    if (!this.config.enabled) {
      throw new Error('Integração com OLLAMA não está habilitada');
    }

    const modelToUse = model || this.config.selectedModel;
    if (!modelToUse) {
      throw new Error('Nenhum modelo selecionado');
    }

    const requestBody = {
      model: modelToUse,
      prompt: message,
      stream: !!onToken, // Habilita streaming se callback fornecido
      options: {
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.9,
        top_k: options.top_k || 40,
        ...options
      }
    };

    try {
      const response = await this.makeRequest('/api/generate', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro do OLLAMA: ${response.status} - ${errorData}`);
      }

      if (onToken && requestBody.stream) {
        // Streaming mode
        return await this.handleStreamingResponse(response, onToken);
      } else {
        // Non-streaming mode
        const data = await response.json();
        return data.response || '';
      }
    } catch (error) {
      // Tratamento específico para diferentes tipos de erro
      if (error.name === 'AbortError') {
        throw new Error(`Timeout: A resposta do Ollama demorou mais que ${requestBody.stream ? '10 minutos' : this.config.timeout / 1000 + ' segundos'}`);
      }
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA. Verifique se o serviço está rodando.');
      }
      
      if (error.message && error.message.includes('NetworkError')) {
        throw new Error('Erro de rede ao conectar com o OLLAMA. Verifique sua conexão.');
      }
      
      throw error;
    }
  }

  /**
   * Processa resposta em streaming
   * @param {Response} response - Resposta da API
   * @param {Function} onToken - Callback para tokens
   * @returns {Promise<string>} - Resposta completa
   * @private
   */
  async handleStreamingResponse(response, onToken) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = ''; // Buffer para chunks incompletos
    let lastCallbackTime = 0;
    const throttleMs = 16; // ~60fps para suavidade visual

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Processa qualquer dados restantes no buffer
          if (buffer.trim()) {
            try {
              const data = JSON.parse(buffer);
              if (data.response) {
                fullResponse += data.response;
                if (onToken) {
                  try {
                    onToken(data.response, fullResponse, data.done || true); // Final sempre chama
                  } catch (callbackError) {
                    console.warn('Erro no callback onToken final:', callbackError);
                  }
                }
              }
            } catch (parseError) {
              console.warn('Buffer final inválido:', buffer);
            }
          }
          break;
        }

        // Decodifica o chunk e adiciona ao buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Processa linhas completas do buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Mantém a última linha (potencialmente incompleta) no buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const data = JSON.parse(trimmedLine);
            
            if (data.response) {
              fullResponse += data.response;
              // Chama o callback com throttling para performance
              if (onToken) {
                const now = Date.now();
                const shouldCallback = now - lastCallbackTime >= throttleMs || data.done;
                
                if (shouldCallback) {
                  try {
                    onToken(data.response, fullResponse, data.done || false);
                    lastCallbackTime = now;
                  } catch (callbackError) {
                    console.warn('Erro no callback onToken:', callbackError);
                  }
                }
              }
            }

                  // Se chegou ao fim, para o loop
      if (data.done) {
        // Remove prefixos indesejados da resposta final
        let cleanResponse = fullResponse.trim();
        const prefixesToRemove = [
          'Assistente:', 'Assistant:', 'Resposta:', 'Response:',
          'AI:', 'IA:', 'Bot:', 'Chatbot:', 'Sistema:'
        ];
        
        for (const prefix of prefixesToRemove) {
          if (cleanResponse.startsWith(prefix)) {
            cleanResponse = cleanResponse.substring(prefix.length).trim();
            break;
          }
        }
        
        // Garante que o callback final seja chamado com a resposta limpa
        if (onToken && cleanResponse) {
          try {
            onToken('', cleanResponse, true); // Envia resposta final limpa
          } catch (callbackError) {
            console.warn('Erro no callback final done:', callbackError);
          }
        }
        return cleanResponse;
      }
          } catch (parseError) {
            // Linha não é JSON válido - pode ser fragmento
            console.warn('Linha JSON inválida (pode ser fragmento):', trimmedLine.substring(0, 100));
          }
        }
      }

      return fullResponse;
    } catch (error) {
      // Trata erros específicos de streaming
      if (error.name === 'AbortError') {
        throw new Error('Streaming foi interrompido devido a timeout');
      }
      
      console.error('Erro no streaming:', error);
      throw error;
    } finally {
      try {
        reader.releaseLock();
      } catch (releaseError) {
        console.warn('Erro ao liberar reader:', releaseError);
      }
    }
  }

  /**
   * Lista todos os modelos disponíveis
   * @returns {Promise<OllamaModel[]>} - Lista de modelos
   */
  async listModels() {
    try {
      const response = await this.makeRequest('/api/tags');
      
      if (!response.ok) {
        throw new Error(`Erro ao listar modelos: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.models || !Array.isArray(data.models)) {
        return [];
      }

      return data.models.map(modelData => OllamaModel.fromApiData(modelData));
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA para listar modelos.');
      }
      throw error;
    }
  }

  /**
   * Verifica se o OLLAMA está disponível
   * @returns {Promise<boolean>} - Se o serviço está disponível
   */
  async checkHealth() {
    try {
      const response = await this.makeRequest('/api/version', {
        method: 'GET'
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém informações de um modelo específico
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<Object>} - Informações do modelo
   */
  async getModelInfo(modelName) {
    try {
      const response = await this.makeRequest('/api/show', {
        method: 'POST',
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter informações do modelo: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA.');
      }
      throw error;
    }
  }

  /**
   * Puxa um modelo do repositório remoto
   * @param {string} modelName - Nome do modelo
   * @param {Function} onProgress - Callback de progresso
   * @returns {Promise<void>}
   */
  async pullModel(modelName, onProgress = null) {
    try {
      const response = await this.makeRequest('/api/pull', {
        method: 'POST',
        body: JSON.stringify({ name: modelName, stream: !!onProgress })
      });

      if (!response.ok) {
        throw new Error(`Erro ao baixar modelo: ${response.status}`);
      }

      if (onProgress) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const progressData = JSON.parse(line);
              onProgress(progressData);
            } catch (e) {
              // Ignora linhas que não são JSON válido
            }
          }
        }
      } else {
        await response.json();
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA.');
      }
      throw error;
    }
  }

  /**
   * Remove um modelo local
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<void>}
   */
  async deleteModel(modelName) {
    try {
      const response = await this.makeRequest('/api/delete', {
        method: 'DELETE',
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`Erro ao remover modelo: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA.');
      }
      throw error;
    }
  }

  /**
   * Gera embeddings para um texto
   * @param {string} text - Texto para gerar embeddings
   * @param {string} model - Modelo a ser usado
   * @returns {Promise<number[]>} - Array de embeddings
   */
  async generateEmbeddings(text, model) {
    try {
      const response = await this.makeRequest('/api/embeddings', {
        method: 'POST',
        body: JSON.stringify({
          model: model || this.config.selectedModel,
          prompt: text
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar embeddings: ${response.status}`);
      }

      const data = await response.json();
      return data.embedding || [];
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao OLLAMA.');
      }
      throw error;
    }
  }

  /**
   * Obtém a configuração atual do OLLAMA
   * @returns {Promise<OllamaConfig>} - Configuração atual
   */
  async getConfig() {
    // Sempre recarrega a configuração para garantir que está atualizada
    this.reloadConfig();
    return this.config;
  }

  /**
   * Salva a configuração do OLLAMA
   * @param {OllamaConfig} config - Nova configuração
   * @returns {Promise<void>}
   */
  async saveConfig(config) {
    try {
      const validation = config.validate();
      if (!validation.isValid) {
        throw new Error(`Configuração inválida: ${validation.errors.join(', ')}`);
      }

      this.config = config;
      localStorage.setItem('ollama-config', JSON.stringify(config.toObject()));
    } catch (error) {
      throw new Error(`Erro ao salvar configuração: ${error.message}`);
    }
  }

  /**
   * Faz uma requisição para a API do OLLAMA
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções da requisição
   * @returns {Promise<Response>} - Resposta da requisição
   * @private
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Timeout maior para requisições de streaming (como /api/generate)
    const isStreamingEndpoint = endpoint === '/api/generate' || endpoint === '/api/pull';
    const timeoutMs = isStreamingEndpoint ? 600000 : this.config.timeout; // 10 minutos para streaming
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`Timeout na requisição para ${endpoint} (${timeoutMs/1000}s)`);
      }
      
      throw error;
    }
  }
}
