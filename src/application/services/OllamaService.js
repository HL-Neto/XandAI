import { OllamaApiRepository } from '../../infrastructure/api/OllamaApiRepository.js';

/**
 * Serviço para gerenciar integração com OLLAMA
 * @class OllamaService
 */
export class OllamaService {
  /**
   * @param {OllamaRepository} repository - Repositório do OLLAMA
   */
  constructor(repository = null) {
    this.repository = repository || new OllamaApiRepository();
  }

  /**
   * Envia uma mensagem usando OLLAMA
   * @param {string} message - Mensagem para enviar
   * @param {Object} options - Opções adicionais
   * @param {Function} onToken - Callback para streaming de tokens
   * @returns {Promise<string>} - Resposta do modelo
   */
  async sendMessage(message, options = {}, onToken = null) {
    try {
      const config = await this.repository.getConfig();
      
      if (!config.enabled) {
        throw new Error('Integração com OLLAMA não está habilitada');
      }

      if (!config.selectedModel) {
        throw new Error('Nenhum modelo selecionado');
      }

      return await this.repository.sendMessage(message, config.selectedModel, options, onToken);
    } catch (error) {
      console.error('Erro no OllamaService.sendMessage:', error);
      throw error;
    }
  }

  /**
   * Lista todos os modelos disponíveis
   * @returns {Promise<OllamaModel[]>} - Lista de modelos
   */
  async listAvailableModels() {
    try {
      return await this.repository.listModels();
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      throw new Error('Falha ao obter lista de modelos do OLLAMA');
    }
  }

  /**
   * Verifica se o OLLAMA está disponível e funcionando
   * @returns {Promise<Object>} - Status do serviço
   */
  async checkServiceStatus() {
    try {
      const isHealthy = await this.repository.checkHealth();
      const config = await this.repository.getConfig();
      
      let modelStatus = 'not_selected';
      let availableModels = [];

      if (isHealthy) {
        try {
          availableModels = await this.repository.listModels();
          
          if (config.selectedModel) {
            const selectedModelExists = availableModels.some(
              model => model.name === config.selectedModel
            );
            modelStatus = selectedModelExists ? 'available' : 'not_found';
          }
        } catch (error) {
          console.warn('Erro ao verificar modelos:', error);
        }
      }

      return {
        isConnected: isHealthy,
        isConfigured: config.enabled && !!config.selectedModel,
        selectedModel: config.selectedModel,
        modelStatus,
        availableModels: availableModels.length,
        baseUrl: config.baseUrl,
        lastChecked: new Date()
      };
    } catch (error) {
      console.error('Erro ao verificar status do OLLAMA:', error);
      return {
        isConnected: false,
        isConfigured: false,
        selectedModel: null,
        modelStatus: 'unknown',
        availableModels: 0,
        baseUrl: null,
        lastChecked: new Date(),
        error: error.message
      };
    }
  }

  /**
   * Obtém a configuração atual
   * @returns {Promise<OllamaConfig>} - Configuração atual
   */
  async getConfiguration() {
    return await this.repository.getConfig();
  }

  /**
   * Atualiza a configuração
   * @param {Object} updates - Atualizações para a configuração
   * @returns {Promise<OllamaConfig>} - Configuração atualizada
   */
  async updateConfiguration(updates) {
    try {
      const currentConfig = await this.repository.getConfig();
      currentConfig.update(updates);
      
      await this.repository.saveConfig(currentConfig);
      return currentConfig;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  }

  /**
   * Testa a conexão com o OLLAMA
   * @param {string} baseUrl - URL para testar (opcional)
   * @returns {Promise<Object>} - Resultado do teste
   */
  async testConnection(baseUrl = null) {
    try {
      const originalConfig = await this.repository.getConfig();
      
      // Se uma URL foi fornecida, usa temporariamente
      if (baseUrl) {
        const tempConfig = { ...originalConfig.toObject(), baseUrl };
        await this.repository.saveConfig(originalConfig.constructor.fromObject(tempConfig));
      }

      const isHealthy = await this.repository.checkHealth();
      let models = [];
      let error = null;

      if (isHealthy) {
        try {
          models = await this.repository.listModels();
        } catch (modelError) {
          error = `Conectado, mas erro ao listar modelos: ${modelError.message}`;
        }
      }

      // Restaura configuração original se uma URL temporária foi usada
      if (baseUrl) {
        await this.repository.saveConfig(originalConfig);
      }

      return {
        success: isHealthy,
        modelsCount: models.length,
        models: models.slice(0, 5), // Primeiros 5 modelos para preview
        error,
        testedUrl: baseUrl || originalConfig.baseUrl
      };
    } catch (error) {
      return {
        success: false,
        modelsCount: 0,
        models: [],
        error: error.message,
        testedUrl: baseUrl
      };
    }
  }

  /**
   * Baixa um modelo do repositório remoto
   * @param {string} modelName - Nome do modelo
   * @param {Function} onProgress - Callback de progresso
   * @returns {Promise<void>}
   */
  async downloadModel(modelName, onProgress = null) {
    try {
      await this.repository.pullModel(modelName, onProgress);
    } catch (error) {
      console.error(`Erro ao baixar modelo ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Remove um modelo local
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<void>}
   */
  async removeModel(modelName) {
    try {
      await this.repository.deleteModel(modelName);
    } catch (error) {
      console.error(`Erro ao remover modelo ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Obtém informações detalhadas de um modelo
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<Object>} - Informações do modelo
   */
  async getModelDetails(modelName) {
    try {
      return await this.repository.getModelInfo(modelName);
    } catch (error) {
      console.error(`Erro ao obter detalhes do modelo ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Seleciona um modelo para uso
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<void>}
   */
  async selectModel(modelName) {
    try {
      // Verifica se o modelo existe
      const models = await this.repository.listModels();
      const modelExists = models.some(model => model.name === modelName);
      
      if (!modelExists) {
        throw new Error(`Modelo '${modelName}' não foi encontrado`);
      }

      await this.updateConfiguration({ selectedModel: modelName });
    } catch (error) {
      console.error(`Erro ao selecionar modelo ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Habilita ou desabilita a integração com OLLAMA
   * @param {boolean} enabled - Se deve habilitar
   * @returns {Promise<void>}
   */
  async toggleIntegration(enabled) {
    try {
      await this.updateConfiguration({ enabled });
    } catch (error) {
      console.error('Erro ao alterar status da integração:', error);
      throw error;
    }
  }
}
