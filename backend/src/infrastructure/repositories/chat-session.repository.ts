import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IChatSessionRepository } from '../../domain/repositories/chat-session.repository.interface';
import { ChatSession } from '../../domain/entities/chat-session.entity';

/**
 * Implementação do repositório de sessões de chat usando TypeORM
 */
@Injectable()
export class ChatSessionRepository implements IChatSessionRepository {
  constructor(
    @InjectRepository(ChatSession)
    private readonly sessionRepository: Repository<ChatSession>,
  ) {}

  async findById(id: string): Promise<ChatSession | null> {
    return await this.sessionRepository.findOne({ where: { id } });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ChatSession | null> {
    return await this.sessionRepository.findOne({ where: { id, userId } });
  }

  async create(sessionData: Partial<ChatSession>): Promise<ChatSession> {
    const session = this.sessionRepository.create(sessionData);
    return await this.sessionRepository.save(session);
  }

  async update(id: string, sessionData: Partial<ChatSession>): Promise<ChatSession> {
    await this.sessionRepository.update(id, sessionData);
    const updatedSession = await this.findById(id);
    if (!updatedSession) {
      throw new Error('Sessão não encontrada após atualização');
    }
    return updatedSession;
  }

  async delete(id: string): Promise<void> {
    await this.sessionRepository.delete(id);
  }

  async findByUserId(
    userId: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<{ sessions: ChatSession[]; total: number }> {
    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { 
        userId,
        status: 'active' // Apenas sessões ativas por padrão
      },
      relations: ['messages'], // Carrega as mensagens para calcular messageCount
      skip: (page - 1) * limit,
      take: limit,
      order: {
        lastActivityAt: 'DESC',
        createdAt: 'DESC',
      },
    });

    return { sessions, total };
  }

  async findActiveByUserId(userId: string): Promise<ChatSession[]> {
    return await this.sessionRepository.find({
      where: { 
        userId,
        status: 'active'
      },
      relations: ['messages'], // Carrega as mensagens
      order: {
        lastActivityAt: 'DESC',
      },
    });
  }

  async findWithMessages(id: string): Promise<ChatSession | null> {
    return await this.sessionRepository.findOne({
      where: { id },
      relations: ['messages'],
      order: {
        messages: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async archive(id: string): Promise<void> {
    await this.sessionRepository.update(id, { status: 'archived' });
  }

  async activate(id: string): Promise<void> {
    await this.sessionRepository.update(id, { status: 'active' });
  }

  async softDelete(id: string): Promise<void> {
    await this.sessionRepository.update(id, { status: 'deleted' });
  }

  async findByTitle(title: string, userId: string): Promise<ChatSession[]> {
    return await this.sessionRepository.find({
      where: {
        userId,
        title: title, // Para busca exata
        status: 'active',
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findRecent(userId: string, limit: number = 10): Promise<ChatSession[]> {
    return await this.sessionRepository.find({
      where: {
        userId,
        status: 'active',
      },
      take: limit,
      order: {
        lastActivityAt: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.sessionRepository.count({
      where: { userId },
    });
  }

  async countActiveByUserId(userId: string): Promise<number> {
    return await this.sessionRepository.count({
      where: { 
        userId,
        status: 'active'
      },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.sessionRepository.count({
      where: { id },
    });
    return count > 0;
  }

  async belongsToUser(sessionId: string, userId: string): Promise<boolean> {
    const count = await this.sessionRepository.count({
      where: {
        id: sessionId,
        userId,
      },
    });
    return count > 0;
  }

  async updateLastActivity(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
