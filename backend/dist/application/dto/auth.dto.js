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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = exports.ChangePasswordDto = exports.UpdateProfileDto = exports.LoginUserDto = exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Primeiro nome é obrigatório' }),
    (0, class_validator_1.MinLength)(2, { message: 'Primeiro nome deve ter pelo menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Primeiro nome deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Sobrenome é obrigatório' }),
    (0, class_validator_1.MinLength)(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Sobrenome deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Senha é obrigatória' }),
    (0, class_validator_1.MinLength)(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Senha deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['light', 'dark'], { message: 'Tema deve ser light ou dark' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "theme", void 0);
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email deve ter um formato válido' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Senha é obrigatória' }),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['light', 'dark']),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Senha atual é obrigatória' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nova senha é obrigatória' }),
    (0, class_validator_1.MinLength)(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nova senha deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth.dto.js.map