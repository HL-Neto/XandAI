import { useState, useEffect, useCallback } from 'react';
import { ChatService } from '../services/ChatService.js';
import { MockChatRepository } from '../../infrastructure/mock-api/MockChatRepository.js';
import { Message } from '../../domain/entities/Message.js';

/**
 * Hook personalizado para gerenciar o estado do chat
 * @returns {Object} - Estado e funções do chat
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatService] = useState(() => {
    const repository = new MockChatRepository();
    return new ChatService(repository);
  });

  /**
   * Carrega o histórico de mensagens na inicialização
   */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatService.getMessageHistory();
        setMessages(history);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setError('Falha ao carregar histórico de mensagens');
      }
    };

    loadHistory();
  }, [chatService]);

  /**
   * Envia uma nova mensagem
   * @param {string} messageContent - Conteúdo da mensagem
   */
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Adiciona a mensagem do usuário imediatamente
      const userMessage = Message.createUserMessage(messageContent);
      setMessages(prev => [...prev, userMessage]);

      // Cria mensagem de resposta vazia para streaming
      const assistantMessageId = `msg_${Date.now()}_assistant`;
      const streamingMessage = Message.createAssistantMessage('');
      streamingMessage.id = assistantMessageId;
      streamingMessage.isStreaming = true;
      
      setMessages(prev => [...prev, streamingMessage]);

      // Callback para streaming de tokens
      const onToken = (token, fullText, isDone) => {
        setMessages(prev => 
          prev.map(msg => {
            if (msg.id === assistantMessageId) {
              // Mantém a instância da classe Message, mas atualiza propriedades
              msg.content = fullText;
              msg.isStreaming = !isDone;
              return msg;
            }
            return msg;
          })
        );
      };

      // Envia mensagem com streaming - vamos modificar para não duplicar userMessage
      const response = await chatService.sendMessageWithoutUserSave(messageContent, onToken);

      // Atualiza a mensagem final do assistente
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? response.assistantMessage
            : msg
        )
      );

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message || 'Falha ao enviar mensagem');
      
      // Remove mensagem de streaming em caso de erro
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
    } finally {
      setIsLoading(false);
    }
  }, [chatService]);

  /**
   * Limpa todo o histórico de mensagens
   */
  const clearHistory = useCallback(async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
      setError(err.message || 'Falha ao limpar histórico');
    }
  }, [chatService]);

  /**
   * Limpa o erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Cria uma nova sessão de chat
   */
  const startNewSession = useCallback(() => {
    chatService.createNewSession();
    setMessages([]);
    setError(null);
  }, [chatService]);

  /**
   * Verifica se há uma mensagem sendo digitada
   */
  const isTyping = messages.some(msg => msg.isTyping);

  /**
   * Obtém a contagem de mensagens
   */
  const messageCount = messages.filter(msg => !msg.isTyping).length;

  /**
   * Verifica se há mensagens no chat
   */
  const hasMessages = messageCount > 0;

  return {
    // Estado
    messages: messages.filter(msg => !msg.isTyping), // Filtra mensagens de digitação para a UI
    isLoading,
    isTyping,
    error,
    hasMessages,
    messageCount,

    // Ações
    sendMessage,
    clearHistory,
    clearError,
    startNewSession,

    // Utilitários
    chatService
  };
};
