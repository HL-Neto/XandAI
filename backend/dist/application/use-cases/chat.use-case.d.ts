import { IChatSessionRepository } from '../../domain/repositories/chat-session.repository.interface';
import { IChatMessageRepository } from '../../domain/repositories/chat-message.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { OllamaService } from '../../infrastructure/services/ollama.service';
import { CreateChatSessionDto, UpdateChatSessionDto, SendMessageDto, SendMessageResponseDto, ChatSessionResponseDto, ChatMessageResponseDto, SearchMessagesDto } from '../dto/chat.dto';
export declare class ChatUseCase {
    private readonly chatSessionRepository;
    private readonly chatMessageRepository;
    private readonly userRepository;
    private readonly ollamaService;
    constructor(chatSessionRepository: IChatSessionRepository, chatMessageRepository: IChatMessageRepository, userRepository: IUserRepository, ollamaService: OllamaService);
    createSession(userId: string, createSessionDto: CreateChatSessionDto): Promise<ChatSessionResponseDto>;
    getUserSessions(userId: string, page?: number, limit?: number): Promise<{
        sessions: ChatSessionResponseDto[];
        total: number;
    }>;
    getSessionWithMessages(userId: string, sessionId: string): Promise<ChatSessionResponseDto>;
    updateSession(userId: string, sessionId: string, updateSessionDto: UpdateChatSessionDto): Promise<ChatSessionResponseDto>;
    archiveSession(userId: string, sessionId: string): Promise<void>;
    deleteSession(userId: string, sessionId: string): Promise<void>;
    sendMessage(userId: string, sendMessageDto: SendMessageDto): Promise<SendMessageResponseDto>;
    getSessionMessages(userId: string, sessionId: string, page?: number, limit?: number): Promise<{
        messages: ChatMessageResponseDto[];
        total: number;
    }>;
    searchMessages(userId: string, searchDto: SearchMessagesDto): Promise<ChatMessageResponseDto[]>;
    private generateAIResponse;
    private buildConversationContext;
    private generateSessionTitle;
    private mapSessionToDto;
    private mapMessageToDto;
    addMessageToSession(userId: string, sessionId: string, content: string, role: string): Promise<ChatMessageResponseDto>;
    attachImageToMessage(userId: string, messageId: string, imageUrl: string, filename: string, originalPrompt?: string, metadata?: any): Promise<ChatMessageResponseDto>;
    private mapMessageWithAttachmentsToDto;
    private generateTitleForSession;
}
