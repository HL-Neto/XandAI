import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Serviço para integração com Ollama API
 */
@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly ollamaBaseUrl: string;
  private readonly defaultModel: string;

  constructor(private readonly configService: ConfigService) {
    this.ollamaBaseUrl = this.configService.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
    this.defaultModel = this.configService.get<string>('OLLAMA_DEFAULT_MODEL', 'llama2');
  }

  /**
   * Gera um título para a conversa baseado na primeira mensagem do usuário
   * @param firstUserMessage - Primeira mensagem do usuário
   * @returns Promise com o título gerado
   */
  async generateConversationTitle(firstUserMessage: string): Promise<string> {
    try {
      this.logger.log(`Gerando título para mensagem: ${firstUserMessage.substring(0, 50)}...`);

      const prompt = `Based on this user message, generate a short, descriptive title (maximum 4-5 words) for a conversation. Respond only with the title, no quotes, no explanation:

User message: "${firstUserMessage}"

Title:`;

      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 50,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedTitle = data.response?.trim();

      if (!generatedTitle) {
        throw new Error('Empty response from Ollama');
      }

      // Limpa o título (remove aspas, quebras de linha, etc.)
      const cleanTitle = this.cleanTitle(generatedTitle);
      
      this.logger.log(`Título gerado: "${cleanTitle}"`);
      return cleanTitle;

    } catch (error) {
      this.logger.error(`Erro ao gerar título: ${error.message}`);
      // Fallback: gera título baseado na mensagem
      return this.generateFallbackTitle(firstUserMessage);
    }
  }

  /**
   * Gera um título de fallback quando a API do Ollama falha
   * @param message - Mensagem do usuário
   * @returns Título de fallback
   */
  private generateFallbackTitle(message: string): string {
    // Remove caracteres especiais e pega as primeiras palavras
    const words = message
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 0)
      .slice(0, 4);

    if (words.length === 0) {
      return 'Nova Conversa';
    }

    let title = words.join(' ');
    
    // Limita o tamanho
    if (title.length > 30) {
      title = title.substring(0, 27) + '...';
    }

    // Capitaliza a primeira letra
    title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    return title;
  }

  /**
   * Limpa e formata o título gerado
   * @param title - Título bruto
   * @returns Título limpo
   */
  private cleanTitle(title: string): string {
    let cleaned = title
      .replace(/['"]/g, '') // Remove aspas
      .replace(/\n/g, ' ') // Substitui quebras de linha por espaços
      .replace(/\s+/g, ' ') // Substitui múltiplos espaços por um só
      .trim();

    // Limita o tamanho
    if (cleaned.length > 40) {
      cleaned = cleaned.substring(0, 37) + '...';
    }

    // Se estiver vazio, usa fallback
    if (!cleaned) {
      cleaned = 'Nova Conversa';
    }

    return cleaned;
  }

  /**
   * Gera uma resposta usando o Ollama API
   * @param prompt - Prompt completo incluindo contexto
   * @param options - Opções para a geração
   * @returns Promise com a resposta gerada
   */
  async generateResponse(
    prompt: string, 
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      ollamaConfig?: {
        baseUrl?: string;
        timeout?: number;
        enabled?: boolean;
      };
      [key: string]: any;
    } = {}
  ): Promise<{
    content: string;
    model: string;
    tokens: number;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Usa configuração dinâmica se fornecida, senão usa a configuração padrão
      const baseUrl = options.ollamaConfig?.baseUrl || this.ollamaBaseUrl;
      const timeout = options.ollamaConfig?.timeout || 300000;
      
      this.logger.log(`Gerando resposta com modelo: ${options.model || this.defaultModel}`);
      this.logger.log(`Usando Ollama URL: ${baseUrl}`);

      const requestBody = {
        model: options.model || this.defaultModel,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2048,
          top_p: 0.9,
          top_k: 40,
        },
      };

      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(timeout), // timeout dinâmico
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (!data.response) {
        throw new Error('Empty response from Ollama API');
      }

      this.logger.log(`Resposta gerada em ${processingTime}ms`);

      // Remove prefixos indesejados da resposta
      let cleanContent = data.response.trim();
      
      // Remove prefixos comuns que o modelo pode adicionar
      const prefixesToRemove = [
        'Assistente:', 'Assistant:', 'Resposta:', 'Response:',
        'AI:', 'IA:', 'Bot:', 'Chatbot:', 'Sistema:'
      ];
      
      for (const prefix of prefixesToRemove) {
        if (cleanContent.startsWith(prefix)) {
          cleanContent = cleanContent.substring(prefix.length).trim();
          this.logger.log(`Removido prefixo: ${prefix}`);
          break;
        }
      }

      return {
        content: cleanContent,
        model: requestBody.model,
        tokens: data.eval_count || 0,
        processingTime,
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Erro ao gerar resposta: ${error.message} (${processingTime}ms)`);
      throw error;
    }
  }

  /**
   * Verifica se o serviço Ollama está disponível
   * @returns Promise<boolean>
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 segundo timeout
      });

      return response.ok;
    } catch (error) {
      this.logger.warn(`Ollama não está disponível: ${error.message}`);
      return false;
    }
  }

  /**
   * Lista os modelos disponíveis no Ollama
   * @returns Promise com lista de modelos
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      this.logger.error(`Erro ao buscar modelos: ${error.message}`);
      return [];
    }
  }
}
