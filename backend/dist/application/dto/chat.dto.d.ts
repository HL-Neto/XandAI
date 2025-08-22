export declare class CreateChatSessionDto {
    title?: string;
    description?: string;
    metadata?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        [key: string]: any;
    };
}
export declare class UpdateChatSessionDto {
    title?: string;
    description?: string;
    status?: 'active' | 'archived';
    metadata?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        [key: string]: any;
    };
}
export declare class CreateChatMessageDto {
    content: string;
    chatSessionId: string;
    metadata?: {
        model?: string;
        temperature?: number;
        [key: string]: any;
    };
}
export declare class SendMessageDto {
    content: string;
    sessionId?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    metadata?: Record<string, any>;
}
export declare class SearchMessagesDto {
    query: string;
    sessionId?: string;
    page?: number;
    limit?: number;
}
export declare class ChatMessageResponseDto {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    status: string;
    metadata?: Record<string, any>;
    attachments?: {
        type: string;
        url: string;
        filename: string;
        originalPrompt?: string;
        metadata?: any;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare class ChatSessionResponseDto {
    id: string;
    title?: string;
    description?: string;
    status: string;
    metadata?: Record<string, any>;
    messageCount: number;
    lastActivityAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    messages?: ChatMessageResponseDto[];
}
export declare class AttachImageToMessageDto {
    messageId: string;
    imageUrl: string;
    filename: string;
    originalPrompt?: string;
    metadata?: Record<string, any>;
}
export declare class ChatMessageWithAttachmentsResponseDto extends ChatMessageResponseDto {
    attachments?: {
        type: string;
        url: string;
        filename: string;
        originalPrompt?: string;
        metadata?: any;
    }[];
}
export declare class SendMessageResponseDto {
    userMessage: ChatMessageResponseDto;
    assistantMessage: ChatMessageResponseDto;
    session: ChatSessionResponseDto;
}
