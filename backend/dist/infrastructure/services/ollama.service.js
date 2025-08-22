"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OllamaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let OllamaService = OllamaService_1 = class OllamaService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(OllamaService_1.name);
        this.ollamaBaseUrl = this.configService.get('OLLAMA_BASE_URL', 'http://localhost:11434');
        this.defaultModel = this.configService.get('OLLAMA_DEFAULT_MODEL', 'llama2');
    }
    async generateConversationTitle(firstUserMessage) {
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
            const cleanTitle = this.cleanTitle(generatedTitle);
            this.logger.log(`Título gerado: "${cleanTitle}"`);
            return cleanTitle;
        }
        catch (error) {
            this.logger.error(`Erro ao gerar título: ${error.message}`);
            return this.generateFallbackTitle(firstUserMessage);
        }
    }
    generateFallbackTitle(message) {
        const words = message
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter(word => word.length > 0)
            .slice(0, 4);
        if (words.length === 0) {
            return 'Nova Conversa';
        }
        let title = words.join(' ');
        if (title.length > 30) {
            title = title.substring(0, 27) + '...';
        }
        title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
        return title;
    }
    cleanTitle(title) {
        let cleaned = title
            .replace(/['"]/g, '')
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (cleaned.length > 40) {
            cleaned = cleaned.substring(0, 37) + '...';
        }
        if (!cleaned) {
            cleaned = 'Nova Conversa';
        }
        return cleaned;
    }
    async generateResponse(prompt, options = {}) {
        const startTime = Date.now();
        try {
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
                signal: AbortSignal.timeout(timeout),
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
            let cleanContent = data.response.trim();
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
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            this.logger.error(`Erro ao gerar resposta: ${error.message} (${processingTime}ms)`);
            throw error;
        }
    }
    async isAvailable() {
        try {
            const response = await fetch(`${this.ollamaBaseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });
            return response.ok;
        }
        catch (error) {
            this.logger.warn(`Ollama não está disponível: ${error.message}`);
            return false;
        }
    }
    async getAvailableModels() {
        try {
            const response = await fetch(`${this.ollamaBaseUrl}/api/tags`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            return data.models?.map((model) => model.name) || [];
        }
        catch (error) {
            this.logger.error(`Erro ao buscar modelos: ${error.message}`);
            return [];
        }
    }
};
exports.OllamaService = OllamaService;
exports.OllamaService = OllamaService = OllamaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OllamaService);
//# sourceMappingURL=ollama.service.js.map