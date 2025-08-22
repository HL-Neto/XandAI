import { ConfigService } from '@nestjs/config';
export declare class OllamaService {
    private readonly configService;
    private readonly logger;
    private readonly ollamaBaseUrl;
    private readonly defaultModel;
    constructor(configService: ConfigService);
    generateConversationTitle(firstUserMessage: string): Promise<string>;
    private generateFallbackTitle;
    private cleanTitle;
    generateResponse(prompt: string, options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        ollamaConfig?: {
            baseUrl?: string;
            timeout?: number;
            enabled?: boolean;
        };
        [key: string]: any;
    }): Promise<{
        content: string;
        model: string;
        tokens: number;
        processingTime: number;
    }>;
    isAvailable(): Promise<boolean>;
    getAvailableModels(): Promise<string[]>;
}
