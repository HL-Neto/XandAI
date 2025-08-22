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
exports.SendMessageResponseDto = exports.ChatMessageWithAttachmentsResponseDto = exports.AttachImageToMessageDto = exports.ChatSessionResponseDto = exports.ChatMessageResponseDto = exports.SearchMessagesDto = exports.SendMessageDto = exports.CreateChatMessageDto = exports.UpdateChatSessionDto = exports.CreateChatSessionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateChatSessionDto {
}
exports.CreateChatSessionDto = CreateChatSessionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatSessionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChatSessionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateChatSessionDto.prototype, "metadata", void 0);
class UpdateChatSessionDto {
}
exports.UpdateChatSessionDto = UpdateChatSessionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatSessionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateChatSessionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['active', 'archived']),
    __metadata("design:type", String)
], UpdateChatSessionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateChatSessionDto.prototype, "metadata", void 0);
class CreateChatMessageDto {
}
exports.CreateChatMessageDto = CreateChatMessageDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Conteúdo da mensagem é obrigatório' }),
    __metadata("design:type", String)
], CreateChatMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'ID da sessão deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateChatMessageDto.prototype, "chatSessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateChatMessageDto.prototype, "metadata", void 0);
class SendMessageDto {
}
exports.SendMessageDto = SendMessageDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Conteúdo da mensagem é obrigatório' }),
    __metadata("design:type", String)
], SendMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4),
    __metadata("design:type", String)
], SendMessageDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendMessageDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], SendMessageDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4000),
    __metadata("design:type", Number)
], SendMessageDto.prototype, "maxTokens", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SendMessageDto.prototype, "metadata", void 0);
class SearchMessagesDto {
}
exports.SearchMessagesDto = SearchMessagesDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Termo de busca é obrigatório' }),
    __metadata("design:type", String)
], SearchMessagesDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4),
    __metadata("design:type", String)
], SearchMessagesDto.prototype, "sessionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchMessagesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchMessagesDto.prototype, "limit", void 0);
class ChatMessageResponseDto {
}
exports.ChatMessageResponseDto = ChatMessageResponseDto;
class ChatSessionResponseDto {
}
exports.ChatSessionResponseDto = ChatSessionResponseDto;
class AttachImageToMessageDto {
}
exports.AttachImageToMessageDto = AttachImageToMessageDto;
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'ID da mensagem deve ser um UUID válido' }),
    __metadata("design:type", String)
], AttachImageToMessageDto.prototype, "messageId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'URL da imagem é obrigatória' }),
    __metadata("design:type", String)
], AttachImageToMessageDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nome do arquivo é obrigatório' }),
    __metadata("design:type", String)
], AttachImageToMessageDto.prototype, "filename", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttachImageToMessageDto.prototype, "originalPrompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AttachImageToMessageDto.prototype, "metadata", void 0);
class ChatMessageWithAttachmentsResponseDto extends ChatMessageResponseDto {
}
exports.ChatMessageWithAttachmentsResponseDto = ChatMessageWithAttachmentsResponseDto;
class SendMessageResponseDto {
}
exports.SendMessageResponseDto = SendMessageResponseDto;
//# sourceMappingURL=chat.dto.js.map