import { ChatSession } from '../entities/chat-session.entity';

/**
 * Interface do repositório de sessões de chat
 */
export interface IChatSessionRepository {
  // Operações CRUD básicas
  findById(id: string): Promise<ChatSession | null>;
  findByIdAndUserId(id: string, userId: string): Promise<ChatSession | null>;
  create(sessionData: Partial<ChatSession>): Promise<ChatSession>;
  update(id: string, sessionData: Partial<ChatSession>): Promise<ChatSession>;
  delete(id: string): Promise<void>;
  
  // Operações específicas
  findByUserId(userId: string, page?: number, limit?: number): Promise<{ sessions: ChatSession[]; total: number }>;
  findActiveByUserId(userId: string): Promise<ChatSession[]>;
  findWithMessages(id: string): Promise<ChatSession | null>;
  
  // Operações de status
  archive(id: string): Promise<void>;
  activate(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  
  // Operações de busca
  findByTitle(title: string, userId: string): Promise<ChatSession[]>;
  findRecent(userId: string, limit?: number): Promise<ChatSession[]>;
  
  // Estatísticas
  countByUserId(userId: string): Promise<number>;
  countActiveByUserId(userId: string): Promise<number>;
  
  // Verificações
  existsById(id: string): Promise<boolean>;
  belongsToUser(sessionId: string, userId: string): Promise<boolean>;
  
  // Operações de atividade
  updateLastActivity(sessionId: string): Promise<void>;
}
