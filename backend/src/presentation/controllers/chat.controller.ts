import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';

import { ChatUseCase } from '../../application/use-cases/chat.use-case';
import {
  CreateChatSessionDto,
  UpdateChatSessionDto,
  SendMessageDto,
  SendMessageResponseDto,
  ChatSessionResponseDto,
  ChatMessageResponseDto,
  SearchMessagesDto,
} from '../../application/dto/chat.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Controller responsável pelas operações de chat
 */
@Controller('chat')
export class ChatController {
  constructor(private readonly chatUseCase: ChatUseCase) {}

  /**
   * Cria uma nova sessão de chat
   */
  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  async createSession(
    @Body(ValidationPipe) createSessionDto: CreateChatSessionDto,
  ): Promise<ChatSessionResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.createSession(testUserId, createSessionDto);
  }

  /**
   * Obtém sessões do usuário
   */
  @Get('sessions')
  async getUserSessions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<{ sessions: ChatSessionResponseDto[]; total: number }> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.getUserSessions(testUserId, page, limit);
  }

  /**
   * Obtém uma sessão específica com mensagens
   */
  @Get('sessions/:sessionId')
  async getSessionWithMessages(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<ChatSessionResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.getSessionWithMessages(testUserId, sessionId);
  }

  /**
   * Atualiza uma sessão de chat
   */
  @Put('sessions/:sessionId')
  async updateSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body(ValidationPipe) updateSessionDto: UpdateChatSessionDto,
  ): Promise<ChatSessionResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.updateSession(testUserId, sessionId, updateSessionDto);
  }

  /**
   * Arquiva uma sessão
   */
  @Put('sessions/:sessionId/archive')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archiveSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<void> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.archiveSession(testUserId, sessionId);
  }

  /**
   * Deleta uma sessão (soft delete)
   */
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<void> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.deleteSession(testUserId, sessionId);
  }

  /**
   * Envia uma mensagem e obtém resposta da IA
   */
  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Body(ValidationPipe) sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.sendMessage(testUserId, sendMessageDto);
  }

  /**
   * Envia uma mensagem com IA para uma sessão específica (incluindo histórico)
   */
  @Post('sessions/:sessionId/send')
  @HttpCode(HttpStatus.CREATED)
  async sendMessageToSession(
    @Request() req,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body(ValidationPipe) messageData: { 
      content: string; 
      model?: string; 
      temperature?: number;
      ollamaConfig?: {
        baseUrl?: string;
        timeout?: number;
        enabled?: boolean;
      };
    },
  ): Promise<{ userMessage: ChatMessageResponseDto; assistantMessage: ChatMessageResponseDto }> {
    const sendMessageDto: SendMessageDto = {
      sessionId,
      content: messageData.content,
      model: messageData.model,
      temperature: messageData.temperature,
      metadata: {
        ollamaConfig: messageData.ollamaConfig
      }
    };
    
    const testUserId = 'test-user-id';
    const response = await this.chatUseCase.sendMessage(testUserId, sendMessageDto);
    return {
      userMessage: response.userMessage,
      assistantMessage: response.assistantMessage,
    };
  }

  /**
   * Adiciona uma mensagem a uma sessão específica
   */
  @Post('sessions/:sessionId/messages')
  @HttpCode(HttpStatus.CREATED)
  async addMessageToSession(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body(ValidationPipe) messageData: { content: string; role: string },
  ): Promise<ChatMessageResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.addMessageToSession(testUserId, sessionId, messageData.content, messageData.role);
  }

  /**
   * Obtém mensagens de uma sessão
   */
  @Get('sessions/:sessionId/messages')
  async getSessionMessages(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<{ messages: ChatMessageResponseDto[]; total: number }> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.getSessionMessages(testUserId, sessionId, page, limit);
  }

  /**
   * Obtém mensagens recentes do usuário
   */
  @Get('messages/recent')
  async getRecentMessages(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<{ messages: ChatMessageResponseDto[] }> {
    // Usando ID fixo para teste sem autenticação
    const testUserId = 'test-user-id';
    return await this.chatUseCase.getRecentMessages(testUserId, limit);
  }

  /**
   * Busca mensagens
   */
  @Post('messages/search')
  async searchMessages(
    @Body(ValidationPipe) searchDto: SearchMessagesDto,
  ): Promise<ChatMessageResponseDto[]> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.searchMessages(testUserId, searchDto);
  }

  /**
   * Cria ou atualiza uma mensagem com ID específico
   */
  @Put('messages/:messageId')
  @HttpCode(HttpStatus.OK)
  async createOrUpdateMessage(
    @Param('messageId') messageId: string,
    @Body(ValidationPipe) messageData: { 
      id: string;
      content: string; 
      role: string;
      chatSessionId?: string;
    },
  ): Promise<ChatMessageResponseDto> {
    const testUserId = 'test-user-id';
    return await this.chatUseCase.createOrUpdateMessage(testUserId, messageId, messageData);
  }

  /**
   * Anexa uma imagem a uma mensagem específica
   */
  @Post('messages/:messageId/attachments/image')
  @HttpCode(HttpStatus.CREATED)
  async attachImageToMessage(
    @Param('messageId') messageId: string,
    @Body(ValidationPipe) attachmentData: { 
      imageUrl: string; 
      filename: string; 
      originalPrompt?: string; 
      metadata?: any 
    },
  ): Promise<ChatMessageResponseDto> {
    // Usando ID fixo para teste sem autenticação
    const testUserId = 'test-user-id';
    return await this.chatUseCase.attachImageToMessage(
      testUserId, 
      messageId, 
      attachmentData.imageUrl, 
      attachmentData.filename, 
      attachmentData.originalPrompt,
      attachmentData.metadata
    );
  }

  /**
   * Endpoint para streaming de mensagens (WebSocket alternativo)
   * TODO: Implementar streaming real com WebSockets ou SSE
   */
  @Post('messages/stream')
  @HttpCode(HttpStatus.CREATED)
  async sendMessageStream(
    @Body(ValidationPipe) sendMessageDto: SendMessageDto,
  ): Promise<SendMessageResponseDto> {
    // Por enquanto, usa o mesmo método de envio de mensagem
    // Em uma implementação real, seria configurado streaming
    const testUserId = 'test-user-id';
    return await this.chatUseCase.sendMessage(testUserId, sendMessageDto);
  }
}
