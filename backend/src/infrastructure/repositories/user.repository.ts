import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

/**
 * Implementação do repositório de usuários usando TypeORM
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('Usuário não encontrado após atualização');
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return { users, total };
  }

  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByRole(role: 'user' | 'admin'): Promise<User[]> {
    return await this.userRepository.find({
      where: { role },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async changePassword(id: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email },
    });
    return count > 0;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { id },
    });
    return count > 0;
  }
}
