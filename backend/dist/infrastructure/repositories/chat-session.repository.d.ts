import { Repository } from 'typeorm';
import { IChatSessionRepository } from '../../domain/repositories/chat-session.repository.interface';
import { ChatSession } from '../../domain/entities/chat-session.entity';
export declare class ChatSessionRepository implements IChatSessionRepository {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<ChatSession>);
    findById(id: string): Promise<ChatSession | null>;
    findByIdAndUserId(id: string, userId: string): Promise<ChatSession | null>;
    create(sessionData: Partial<ChatSession>): Promise<ChatSession>;
    update(id: string, sessionData: Partial<ChatSession>): Promise<ChatSession>;
    delete(id: string): Promise<void>;
    findByUserId(userId: string, page?: number, limit?: number): Promise<{
        sessions: ChatSession[];
        total: number;
    }>;
    findActiveByUserId(userId: string): Promise<ChatSession[]>;
    findWithMessages(id: string): Promise<ChatSession | null>;
    archive(id: string): Promise<void>;
    activate(id: string): Promise<void>;
    softDelete(id: string): Promise<void>;
    findByTitle(title: string, userId: string): Promise<ChatSession[]>;
    findRecent(userId: string, limit?: number): Promise<ChatSession[]>;
    countByUserId(userId: string): Promise<number>;
    countActiveByUserId(userId: string): Promise<number>;
    existsById(id: string): Promise<boolean>;
    belongsToUser(sessionId: string, userId: string): Promise<boolean>;
    updateLastActivity(sessionId: string): Promise<void>;
}
