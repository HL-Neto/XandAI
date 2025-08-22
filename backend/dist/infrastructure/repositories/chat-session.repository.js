"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_session_entity_1 = require("../../domain/entities/chat-session.entity");
let ChatSessionRepository = class ChatSessionRepository {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async findById(id) {
        return await this.sessionRepository.findOne({ where: { id } });
    }
    async findByIdAndUserId(id, userId) {
        return await this.sessionRepository.findOne({ where: { id, userId } });
    }
    async create(sessionData) {
        const session = this.sessionRepository.create(sessionData);
        return await this.sessionRepository.save(session);
    }
    async update(id, sessionData) {
        await this.sessionRepository.update(id, sessionData);
        const updatedSession = await this.findById(id);
        if (!updatedSession) {
            throw new Error('Sessão não encontrada após atualização');
        }
        return updatedSession;
    }
    async delete(id) {
        await this.sessionRepository.delete(id);
    }
    async findByUserId(userId, page = 1, limit = 20) {
        const [sessions, total] = await this.sessionRepository.findAndCount({
            where: {
                userId,
                status: 'active'
            },
            relations: ['messages'],
            skip: (page - 1) * limit,
            take: limit,
            order: {
                lastActivityAt: 'DESC',
                createdAt: 'DESC',
            },
        });
        return { sessions, total };
    }
    async findActiveByUserId(userId) {
        return await this.sessionRepository.find({
            where: {
                userId,
                status: 'active'
            },
            relations: ['messages'],
            order: {
                lastActivityAt: 'DESC',
            },
        });
    }
    async findWithMessages(id) {
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
    async archive(id) {
        await this.sessionRepository.update(id, { status: 'archived' });
    }
    async activate(id) {
        await this.sessionRepository.update(id, { status: 'active' });
    }
    async softDelete(id) {
        await this.sessionRepository.update(id, { status: 'deleted' });
    }
    async findByTitle(title, userId) {
        return await this.sessionRepository.find({
            where: {
                userId,
                title: title,
                status: 'active',
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findRecent(userId, limit = 10) {
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
    async countByUserId(userId) {
        return await this.sessionRepository.count({
            where: { userId },
        });
    }
    async countActiveByUserId(userId) {
        return await this.sessionRepository.count({
            where: {
                userId,
                status: 'active'
            },
        });
    }
    async existsById(id) {
        const count = await this.sessionRepository.count({
            where: { id },
        });
        return count > 0;
    }
    async belongsToUser(sessionId, userId) {
        const count = await this.sessionRepository.count({
            where: {
                id: sessionId,
                userId,
            },
        });
        return count > 0;
    }
    async updateLastActivity(sessionId) {
        await this.sessionRepository.update(sessionId, {
            lastActivityAt: new Date(),
            updatedAt: new Date(),
        });
    }
};
exports.ChatSessionRepository = ChatSessionRepository;
exports.ChatSessionRepository = ChatSessionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_session_entity_1.ChatSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatSessionRepository);
//# sourceMappingURL=chat-session.repository.js.map