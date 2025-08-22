"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
let AuthUseCase = class AuthUseCase {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, preferredLanguage, theme } = registerDto;
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email já está em uso');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const userData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            preferredLanguage,
            theme: theme || 'light',
            role: 'user',
            isActive: true,
        };
        const user = await this.userRepository.create(userData);
        const { accessToken, expiresIn } = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            accessToken,
            expiresIn,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Usuário inativo');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        await this.userRepository.updateLastLogin(user.id);
        const { accessToken, expiresIn } = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            accessToken,
            expiresIn,
        };
    }
    async getProfile(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updateDto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const updatedUser = await this.userRepository.update(userId, updateDto);
        return this.sanitizeUser(updatedUser);
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Senha atual incorreta');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        await this.userRepository.changePassword(userId, hashedNewPassword);
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findById(payload.sub);
            if (!user || !user.isActive) {
                return null;
            }
            return this.sanitizeUser(user);
        }
        catch (error) {
            return null;
        }
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const expiresIn = 24 * 60 * 60;
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: `${expiresIn}s`,
        });
        return {
            accessToken,
            expiresIn,
        };
    }
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
};
exports.AuthUseCase = AuthUseCase;
exports.AuthUseCase = AuthUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthUseCase);
//# sourceMappingURL=auth.use-case.js.map