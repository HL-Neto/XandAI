import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';
export declare class ChatSession {
    id: string;
    title?: string;
    description?: string;
    status: 'active' | 'archived' | 'deleted';
    metadata?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        [key: string]: any;
    };
    lastActivityAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
    messages: ChatMessage[];
    updateActivity(): void;
    getMessageCount(): number;
    generateTitle(firstMessage?: string): string;
    archive(): void;
    activate(): void;
    softDelete(): void;
    isActive(): boolean;
    isArchived(): boolean;
    isDeleted(): boolean;
}
