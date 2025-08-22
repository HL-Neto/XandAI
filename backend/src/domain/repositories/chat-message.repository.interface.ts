import { ChatMessage } from '../entities/chat-message.entity';

/**
 * Interface do repositório de mensagens de chat
 */
export interface IChatMessageRepository {
  // Operações CRUD básicas
  findById(id: string): Promise<ChatMessage | null>;
  create(messageData: Partial<ChatMessage>): Promise<ChatMessage>;
  update(id: string, messageData: Partial<ChatMessage>): Promise<ChatMessage>;
  delete(id: string): Promise<void>;
  
  // Operações específicas
  findBySessionId(sessionId: string, page?: number, limit?: number): Promise<{ messages: ChatMessage[]; total: number }>;
  findLastBySessionId(sessionId: string): Promise<ChatMessage | null>;
  findRecentByUserId(userId: string, limit?: number): Promise<ChatMessage[]>;
  findByRole(sessionId: string, role: 'user' | 'assistant' | 'system'): Promise<ChatMessage[]>;
  
  // Operações de busca
  searchInSession(sessionId: string, query: string): Promise<ChatMessage[]>;
  findByDateRange(sessionId: string, startDate: Date, endDate: Date): Promise<ChatMessage[]>;
  
  // Estatísticas
  countBySessionId(sessionId: string): Promise<number>;
  countByRole(sessionId: string, role: 'user' | 'assistant' | 'system'): Promise<number>;
  
  // Operações em lote
  createMany(messagesData: Partial<ChatMessage>[]): Promise<ChatMessage[]>;
  deleteBySessionId(sessionId: string): Promise<void>;
  
  // Verificações
  existsById(id: string): Promise<boolean>;
  belongsToSession(messageId: string, sessionId: string): Promise<boolean>;
}
