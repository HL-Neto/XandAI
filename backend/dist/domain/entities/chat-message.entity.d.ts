import { ChatSession } from './chat-session.entity';
export declare class ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    metadata?: {
        model?: string;
        tokens?: number;
        responseTime?: number;
        temperature?: number;
        [key: string]: any;
    };
    attachments?: {
        type: 'image' | 'file' | 'audio' | 'video';
        url: string;
        filename: string;
        originalPrompt?: string;
        metadata?: any;
        [key: string]: any;
    }[];
    status: 'sent' | 'delivered' | 'error' | 'processing';
    error?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    chatSessionId: string;
    chatSession: ChatSession;
    isUserMessage(): boolean;
    isAssistantMessage(): boolean;
    isSystemMessage(): boolean;
    markAsProcessing(): void;
    markAsDelivered(): void;
    markAsError(errorMessage: string): void;
    getWordCount(): number;
    getCharacterCount(): number;
    truncate(maxLength?: number): string;
    static createUserMessage(content: string, chatSessionId: string): ChatMessage;
    static createAssistantMessage(content: string, chatSessionId: string, metadata?: any): ChatMessage;
    static createSystemMessage(content: string, chatSessionId: string): ChatMessage;
    addAttachment(attachment: {
        type: 'image' | 'file' | 'audio' | 'video';
        url: string;
        filename: string;
        originalPrompt?: string;
        metadata?: any;
    }): void;
    removeAttachment(filename: string): void;
    getImageAttachments(): any[];
    hasAttachments(): boolean;
    isValidContent(): boolean;
    isValidRole(): boolean;
}
