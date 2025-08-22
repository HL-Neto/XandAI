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
exports.ChatUseCase = void 0;
const common_1 = require("@nestjs/common");
const chat_message_entity_1 = require("../../domain/entities/chat-message.entity");
const ollama_service_1 = require("../../infrastructure/services/ollama.service");
let ChatUseCase = class ChatUseCase {
    constructor(chatSessionRepository, chatMessageRepository, userRepository, ollamaService) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.ollamaService = ollamaService;
    }
    async createSession(userId, createSessionDto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário não encontrado');
        }
        const sessionData = {
            userId,
            title: createSessionDto.title || 'Nova Conversa',
            description: createSessionDto.description,
            metadata: createSessionDto.metadata,
            status: 'active',
            lastActivityAt: new Date(),
        };
        const session = await this.chatSessionRepository.create(sessionData);
        return this.mapSessionToDto(session);
    }
    async getUserSessions(userId, page = 1, limit = 20) {
        const { sessions, total } = await this.chatSessionRepository.findByUserId(userId, page, limit);
        return {
            sessions: sessions.map(session => this.mapSessionToDto(session)),
            total,
        };
    }
    async getSessionWithMessages(userId, sessionId) {
        const session = await this.chatSessionRepository.findWithMessages(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Sessão não encontrada');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('Acesso negado à sessão');
        }
        return this.mapSessionToDto(session, true);
    }
    async updateSession(userId, sessionId, updateSessionDto) {
        const session = await this.chatSessionRepository.findById(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Sessão não encontrada');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('Acesso negado à sessão');
        }
        const updatedSession = await this.chatSessionRepository.update(sessionId, updateSessionDto);
        return this.mapSessionToDto(updatedSession);
    }
    async archiveSession(userId, sessionId) {
        const belongsToUser = await this.chatSessionRepository.belongsToUser(sessionId, userId);
        if (!belongsToUser) {
            throw new common_1.ForbiddenException('Acesso negado à sessão');
        }
        await this.chatSessionRepository.archive(sessionId);
    }
    async deleteSession(userId, sessionId) {
        const belongsToUser = await this.chatSessionRepository.belongsToUser(sessionId, userId);
        if (!belongsToUser) {
            throw new common_1.ForbiddenException('Acesso negado à sessão');
        }
        await this.chatSessionRepository.softDelete(sessionId);
    }
    async sendMessage(userId, sendMessageDto) {
        let session;
        if (!sendMessageDto.sessionId) {
            const newSessionData = {
                userId,
                title: this.generateSessionTitle(sendMessageDto.content),
                status: 'active',
                lastActivityAt: new Date(),
                metadata: {
                    model: sendMessageDto.model,
                    temperature: sendMessageDto.temperature,
                    maxTokens: sendMessageDto.maxTokens,
                    ...sendMessageDto.metadata,
                },
            };
            session = await this.chatSessionRepository.create(newSessionData);
        }
        else {
            session = await this.chatSessionRepository.findById(sendMessageDto.sessionId);
            if (!session) {
                throw new common_1.NotFoundException('Sessão não encontrada');
            }
            if (session.userId !== userId) {
                throw new common_1.ForbiddenException('Acesso negado à sessão');
            }
            session.updateActivity();
            await this.chatSessionRepository.update(session.id, { lastActivityAt: session.lastActivityAt });
        }
        const userMessageData = chat_message_entity_1.ChatMessage.createUserMessage(sendMessageDto.content, session.id);
        const userMessage = await this.chatMessageRepository.create(userMessageData);
        const messageHistory = await this.chatMessageRepository.findBySessionId(session.id, 1, 50);
        const aiResponse = await this.generateAIResponse(sendMessageDto.content, sendMessageDto, messageHistory.messages);
        const assistantMessageData = chat_message_entity_1.ChatMessage.createAssistantMessage(aiResponse.content, session.id, aiResponse.metadata);
        const assistantMessage = await this.chatMessageRepository.create(assistantMessageData);
        return {
            userMessage: this.mapMessageToDto(userMessage),
            assistantMessage: this.mapMessageToDto(assistantMessage),
            session: this.mapSessionToDto(session),
        };
    }
    async getSessionMessages(userId, sessionId, page = 1, limit = 50) {
        const belongsToUser = await this.chatSessionRepository.belongsToUser(sessionId, userId);
        if (!belongsToUser) {
            throw new common_1.ForbiddenException('Acesso negado à sessão');
        }
        const { messages, total } = await this.chatMessageRepository.findBySessionId(sessionId, page, limit);
        return {
            messages: messages.map(message => this.mapMessageWithAttachmentsToDto(message)),
            total,
        };
    }
    async searchMessages(userId, searchDto) {
        if (searchDto.sessionId) {
            const belongsToUser = await this.chatSessionRepository.belongsToUser(searchDto.sessionId, userId);
            if (!belongsToUser) {
                throw new common_1.ForbiddenException('Acesso negado à sessão');
            }
            const messages = await this.chatMessageRepository.searchInSession(searchDto.sessionId, searchDto.query);
            return messages.map(message => this.mapMessageToDto(message));
        }
        throw new common_1.BadRequestException('Busca geral ainda não implementada');
    }
    async generateAIResponse(userMessage, options, messageHistory = []) {
        try {
            const context = this.buildConversationContext(messageHistory, userMessage);
            const response = await this.ollamaService.generateResponse(context, {
                model: options.model,
                temperature: options.temperature,
                maxTokens: options.maxTokens,
                ollamaConfig: options.metadata?.ollamaConfig,
                ...options.metadata
            });
            return {
                content: response.content,
                metadata: {
                    model: response.model || options.model || 'llama3.2',
                    temperature: options.temperature || 0.7,
                    tokens: response.tokens || 0,
                    processingTime: response.processingTime || 0,
                    usedHistory: messageHistory.length > 0
                }
            };
        }
        catch (error) {
            console.error('Erro ao gerar resposta da IA:', error);
            const fallbackResponses = [
                'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
                'Ocorreu um problema temporário. Por favor, reformule sua pergunta.',
                'Estou passando por algumas dificuldades técnicas. Tente novamente.'
            ];
            return {
                content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
                metadata: {
                    model: 'fallback',
                    error: true,
                    originalError: error.message,
                    usedHistory: false
                }
            };
        }
    }
    buildConversationContext(messageHistory, currentMessage) {
        let context = '';
        if (messageHistory.length > 0) {
            const sortedHistory = messageHistory.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            const recentMessages = sortedHistory.slice(-10);
            recentMessages.forEach(msg => {
                if (msg.role === 'user') {
                    context += `Usuário: ${msg.content}\n\n`;
                }
                else {
                    context += `Resposta: ${msg.content}\n\n`;
                }
            });
        }
        context += `Usuário: ${currentMessage}\n\nPor favor, responda diretamente sem prefixos:`;
        return context;
    }
    generateSessionTitle(firstMessage) {
        const words = firstMessage.split(' ').slice(0, 5);
        return words.join(' ') + (firstMessage.split(' ').length > 5 ? '...' : '');
    }
    mapSessionToDto(session, includeMessages = false) {
        const dto = {
            id: session.id,
            title: session.title,
            description: session.description,
            status: session.status,
            metadata: session.metadata,
            messageCount: session.getMessageCount(),
            lastActivityAt: session.lastActivityAt,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
        if (includeMessages && session.messages) {
            dto.messages = session.messages.map(message => this.mapMessageToDto(message));
        }
        return dto;
    }
    mapMessageToDto(message) {
        return {
            id: message.id,
            content: message.content,
            role: message.role,
            status: message.status,
            metadata: message.metadata,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    }
    async addMessageToSession(userId, sessionId, content, role) {
        const session = await this.chatSessionRepository.findByIdAndUserId(sessionId, userId);
        if (!session) {
            throw new common_1.NotFoundException('Sessão não encontrada ou não autorizada');
        }
        if (!['user', 'assistant'].includes(role)) {
            throw new common_1.BadRequestException('Role deve ser "user" ou "assistant"');
        }
        const messageData = {
            chatSessionId: sessionId,
            content,
            role: role,
            status: 'sent',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const message = await this.chatMessageRepository.create(messageData);
        if (role === 'user' && (session.title === 'Nova Conversa' || !session.title)) {
            this.generateTitleForSession(sessionId, content).catch(error => {
                console.error('Erro ao gerar título da sessão:', error);
            });
        }
        await this.chatSessionRepository.updateLastActivity(sessionId);
        return {
            id: message.id,
            content: message.content,
            role: message.role,
            status: message.status,
            metadata: message.metadata,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    }
    async attachImageToMessage(userId, messageId, imageUrl, filename, originalPrompt, metadata) {
        const message = await this.chatMessageRepository.findById(messageId);
        if (!message) {
            throw new common_1.NotFoundException('Mensagem não encontrada');
        }
        const session = await this.chatSessionRepository.findByIdAndUserId(message.chatSessionId, userId);
        if (!session) {
            throw new common_1.ForbiddenException('Você não tem permissão para anexar imagens nesta mensagem');
        }
        message.addAttachment({
            type: 'image',
            url: imageUrl,
            filename: filename,
            originalPrompt: originalPrompt,
            metadata: metadata
        });
        const updatedMessage = await this.chatMessageRepository.update(messageId, {
            attachments: message.attachments
        });
        return this.mapMessageWithAttachmentsToDto(updatedMessage);
    }
    mapMessageWithAttachmentsToDto(message) {
        return {
            id: message.id,
            content: message.content,
            role: message.role,
            status: message.status,
            metadata: message.metadata,
            attachments: message.attachments,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        };
    }
    async generateTitleForSession(sessionId, firstUserMessage) {
        try {
            const generatedTitle = await this.ollamaService.generateConversationTitle(firstUserMessage);
            await this.chatSessionRepository.update(sessionId, {
                title: generatedTitle,
                updatedAt: new Date(),
            });
            console.log(`Título gerado para sessão ${sessionId}: "${generatedTitle}"`);
        }
        catch (error) {
            console.error('Erro ao gerar título:', error);
        }
    }
};
exports.ChatUseCase = ChatUseCase;
exports.ChatUseCase = ChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IChatSessionRepository')),
    __param(1, (0, common_1.Inject)('IChatMessageRepository')),
    __param(2, (0, common_1.Inject)('IUserRepository')),
    __metadata("design:paramtypes", [Object, Object, Object, ollama_service_1.OllamaService])
], ChatUseCase);
//# sourceMappingURL=chat.use-case.js.map