import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
export declare class UserRepository implements IUserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, userData: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    findActive(): Promise<User[]>;
    findByRole(role: 'user' | 'admin'): Promise<User[]>;
    updateLastLogin(id: string): Promise<void>;
    changePassword(id: string, hashedPassword: string): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
    existsById(id: string): Promise<boolean>;
}
