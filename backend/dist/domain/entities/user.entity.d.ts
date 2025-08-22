import { ChatSession } from './chat-session.entity';
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    role: 'user' | 'admin';
    preferredLanguage?: string;
    theme: 'light' | 'dark';
    avatar?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    chatSessions: ChatSession[];
    getFullName(): string;
    isAdmin(): boolean;
    updateLastLogin(): void;
    toJSON(): Omit<this, "password" | "getFullName" | "isAdmin" | "updateLastLogin" | "toJSON">;
}
