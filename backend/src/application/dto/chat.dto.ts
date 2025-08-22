import { IsString, IsOptional, IsUUID, IsIn, IsObject, IsNumber, Min, Max } from 'class-validator';

/**
 * DTO para criação de sessão de chat
 */
export class CreateChatSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  };
}

/**
 * DTO para atualização de sessão de chat
 */
export class UpdateChatSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['active', 'archived'])
  status?: 'active' | 'archived';

  @IsOptional()
  @IsObject()
  metadata?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  };
}

/**
 * DTO para criação de mensagem
 */
export class CreateChatMessageDto {
  @IsString({ message: 'Conteúdo da mensagem é obrigatório' })
  content: string;

  @IsUUID(4, { message: 'ID da sessão deve ser um UUID válido' })
  chatSessionId: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    model?: string;
    temperature?: number;
    [key: string]: any;
  };
}

/**
 * DTO para envio de mensagem com resposta da IA
 */
export class SendMessageDto {
  @IsString({ message: 'Conteúdo da mensagem é obrigatório' })
  content: string;

  @IsOptional()
  @IsUUID(4)
  sessionId?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4000)
  maxTokens?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO para busca de mensagens
 */
export class SearchMessagesDto {
  @IsString({ message: 'Termo de busca é obrigatório' })
  query: string;

  @IsOptional()
  @IsUUID(4)
  sessionId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

/**
 * DTO de resposta para mensagem de chat
 */
export class ChatMessageResponseDto {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  status: string;
  metadata?: Record<string, any>;
  attachments?: {
    type: string;
    url: string;
    filename: string;
    originalPrompt?: string;
    metadata?: any;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO de resposta para sessão de chat
 */
export class ChatSessionResponseDto {
  id: string;
  title?: string;
  description?: string;
  status: string;
  metadata?: Record<string, any>;
  messageCount: number;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessageResponseDto[];
}

/**
 * DTO para anexar imagem a uma mensagem
 */
export class AttachImageToMessageDto {
  @IsUUID(4, { message: 'ID da mensagem deve ser um UUID válido' })
  messageId: string;

  @IsString({ message: 'URL da imagem é obrigatória' })
  imageUrl: string;

  @IsString({ message: 'Nome do arquivo é obrigatório' })
  filename: string;

  @IsOptional()
  @IsString()
  originalPrompt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO de resposta para mensagem de chat com anexos
 */
export class ChatMessageWithAttachmentsResponseDto extends ChatMessageResponseDto {
  attachments?: {
    type: string;
    url: string;
    filename: string;
    originalPrompt?: string;
    metadata?: any;
  }[];
}

/**
 * DTO de resposta para envio de mensagem
 */
export class SendMessageResponseDto {
  userMessage: ChatMessageResponseDto;
  assistantMessage: ChatMessageResponseDto;
  session: ChatSessionResponseDto;
}
