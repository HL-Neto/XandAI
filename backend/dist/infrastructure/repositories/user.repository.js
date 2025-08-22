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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../domain/entities/user.entity");
let UserRepository = class UserRepository {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findById(id) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async create(userData) {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    async update(id, userData) {
        await this.userRepository.update(id, userData);
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('Usuário não encontrado após atualização');
        }
        return updatedUser;
    }
    async delete(id) {
        await this.userRepository.delete(id);
    }
    async findAll(page = 1, limit = 20) {
        const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
        return { users, total };
    }
    async findActive() {
        return await this.userRepository.find({
            where: { isActive: true },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findByRole(role) {
        return await this.userRepository.find({
            where: { role },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, {
            lastLoginAt: new Date(),
        });
    }
    async changePassword(id, hashedPassword) {
        await this.userRepository.update(id, {
            password: hashedPassword,
        });
    }
    async existsByEmail(email) {
        const count = await this.userRepository.count({
            where: { email },
        });
        return count > 0;
    }
    async existsById(id) {
        const count = await this.userRepository.count({
            where: { id },
        });
        return count > 0;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map