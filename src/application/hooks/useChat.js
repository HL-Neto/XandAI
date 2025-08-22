import { useState, useEffect, useCallback } from 'react';
import { ChatService } from '../services/ChatService.js';
import { MockChatRepository } from '../../infrastructure/mock-api/MockChatRepository.js';
import { ChatApiRepository } from '../../infrastructure/api/ChatApiRepository.js';
import { Message } from '../../domain/entities/Message.js';

/**
 * Hook personalizado para gerenciar o estado do chat
 * @returns {Object} - Estado e funções do chat
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatService, setChatService] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  /**
   * Inicializa o serviço de chat baseado na disponibilidade do backend
   */
  useEffect(() => {
    const initializeChatService = async () => {
      try {
        const apiRepository = new ChatApiRepository();
        const backendAvailable = await apiRepository.isBackendAvailable();
        
        if (backendAvailable) {
          console.log('✅ Backend disponível - usando ChatApiRepository');
          setChatService(new ChatService(apiRepository));
          setIsBackendConnected(true);
        } else {
          console.log('⚠️ Backend indisponível - usando MockChatRepository');
          setChatService(new ChatService(new MockChatRepository()));
          setIsBackendConnected(false);
        }
      } catch (error) {
        console.error('Erro ao inicializar chat service:', error);
        // Fallback para mock em caso de erro
        setChatService(new ChatService(new MockChatRepository()));
        setIsBackendConnected(false);
      }
    };

    initializeChatService();
  }, []);

  /**
   * Carrega o histórico de mensagens quando o serviço está pronto
   */
  useEffect(() => {
    if (!chatService) return;

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
   * Envia mensagem usando o fluxo local (frontend) como fallback
   */
  const sendMessageLocally = useCallback(async (messageContent, existingAssistantId = null) => {
    try {
      let assistantMessageId = existingAssistantId;
      
      if (!assistantMessageId) {
        // Adiciona a mensagem do usuário imediatamente
        const userMessage = Message.createUserMessage(messageContent);
        setMessages(prev => [...prev, userMessage]);

        // Cria mensagem de resposta vazia para streaming
        assistantMessageId = `msg_${Date.now()}_assistant`;
        const streamingMessage = Message.createAssistantMessage('');
        streamingMessage.id = assistantMessageId;
        streamingMessage.isStreaming = true;
        
        setMessages(prev => [...prev, streamingMessage]);
      }

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

      // Envia mensagem com streaming
      const response = await chatService.sendMessageWithoutUserSave(messageContent, onToken);

      // Atualiza a mensagem final do assistente
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? response.assistantMessage
            : msg
        )
      );

    } catch (error) {
      console.error('Erro no fluxo local:', error);
      throw error;
    }
  }, [chatService]);

  /**
   * Envia uma nova mensagem
   * @param {string} messageContent - Conteúdo da mensagem
   */
  const sendMessage = useCallback(async (messageContent) => {
    if (!messageContent.trim() || !chatService) return;

    setIsLoading(true);
    setError(null);

    try {
      // Adiciona a mensagem do usuário imediatamente
      const userMessage = Message.createUserMessage(messageContent);
      setMessages(prev => [...prev, userMessage]);

      // Salva a mensagem do usuário no backend
      if (isBackendConnected && chatService?.chatRepository?.saveMessageWithId) {
        try {
          await chatService.chatRepository.saveMessageWithId(userMessage.id, userMessage.content, 'user');
        } catch (error) {
          console.warn('Erro ao salvar mensagem do usuário no backend:', error);
        }
      }

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

      // Se há uma sessão ativa, busca o histórico para contexto
      let contextualMessage = messageContent;
      if (currentSessionId) {
        try {
          const chatHistoryService = await import('../../services/ChatHistoryService.js');
          const sessionMessages = await chatHistoryService.default.getSessionMessages(currentSessionId);
          
          // Monta contexto com as últimas 10 mensagens
          if (sessionMessages && sessionMessages.length > 0) {
            const recentMessages = sessionMessages.slice(-10);
            let context = '';
            
            recentMessages.forEach(msg => {
              if (msg.role === 'user') {
                context += `Usuário: ${msg.content}\n\n`;
              } else {
                context += `Resposta: ${msg.content}\n\n`;
              }
            });
            
            contextualMessage = `${context}Usuário: ${messageContent}\n\nPor favor, responda diretamente sem prefixos:`;
          }
        } catch (contextError) {
          console.warn('Erro ao buscar contexto, usando mensagem simples:', contextError);
          // Continua com mensagem simples se não conseguir buscar contexto
        }
      }

      // SEMPRE usa o streaming do frontend para melhor UX, mas com contexto se disponível
      const response = await chatService.sendMessageWithoutUserSave(contextualMessage, onToken);

      // Atualiza a mensagem final do assistente
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? response.assistantMessage
            : msg
        )
      );

      // Salva a mensagem do assistente no backend
      if (isBackendConnected && chatService?.chatRepository?.saveMessageWithId) {
        try {
          await chatService.chatRepository.saveMessageWithId(
            assistantMessageId, 
            response.assistantMessage.content, 
            'assistant'
          );
        } catch (error) {
          console.warn('Erro ao salvar mensagem do assistente no backend:', error);
        }
      }

      // Se há uma sessão ativa, salva no backend APÓS o streaming
      if (currentSessionId) {
        try {
          const chatHistoryService = await import('../../services/ChatHistoryService.js');
          
          // Salva mensagem do usuário
          await chatHistoryService.default.sendMessage(currentSessionId, messageContent, 'user');
          
          // Salva resposta do assistente
          await chatHistoryService.default.sendMessage(currentSessionId, response.assistantMessage.content, 'assistant');

        } catch (backendError) {
          console.error('Erro ao salvar mensagens no backend:', backendError);
          // Não interrompe o fluxo - o streaming já funcionou
        }
      }

    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message || 'Falha ao enviar mensagem');
      
      // Remove mensagem de streaming em caso de erro
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
    } finally {
      setIsLoading(false);
    }
  }, [chatService, currentSessionId, sendMessageLocally]);

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

  /**
   * Força uma nova instância do ChatService (útil quando configuração muda)
   */
  const refreshChatService = useCallback(() => {
    // Força recriação do serviço
    window.location.reload();
  }, []);

  /**
   * Carrega mensagens externas (de uma sessão do backend)
   * @param {Array} externalMessages - Mensagens da sessão
   * @param {string} sessionId - ID da sessão
   */
  const loadExternalMessages = useCallback((externalMessages, sessionId = null) => {
    if (!Array.isArray(externalMessages)) {
      console.warn('loadExternalMessages: externalMessages deve ser um array');
      return;
    }

    // Define a sessão atual
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }

    // Converte mensagens do backend para o formato do frontend
    const formattedMessages = externalMessages.map(msg => {
      const sender = msg.role === 'user' ? 'user' : 'assistant';
      const timestamp = msg.createdAt ? new Date(msg.createdAt) : new Date();
      
      const message = new Message(
        msg.id || `msg_${Date.now()}_${Math.random()}`,
        msg.content || '',
        sender,
        timestamp,
        false, // isTyping
        false  // isStreaming
      );
      
      // Adiciona anexos se existirem
      if (msg.attachments && Array.isArray(msg.attachments)) {
        console.log('Adding attachments to message:', msg.id, msg.attachments);
        message.attachments = msg.attachments;
      }
      
      return message;
    });

    setMessages(formattedMessages);
    setError(null);
  }, []);

  /**
   * Define a sessão atual
   * @param {string} sessionId - ID da sessão
   */
  const setSession = useCallback((sessionId) => {
    setCurrentSessionId(sessionId);
  }, []);

  /**
   * Atualiza os anexos de uma mensagem específica
   * @param {string} messageId - ID da mensagem
   * @param {Object} attachment - Anexo a ser adicionado
   */
  const updateMessageAttachment = useCallback((messageId, attachment) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        // Cria uma cópia da mensagem e adiciona o anexo
        const updatedMsg = Object.assign(Object.create(Object.getPrototypeOf(msg)), msg);
        if (!updatedMsg.attachments) {
          updatedMsg.attachments = [];
        }
        updatedMsg.attachments = [...updatedMsg.attachments, attachment];
        return updatedMsg;
      }
      return msg;
    }));
  }, []);

  return {
    // Estado
    messages: messages.filter(msg => !msg.isTyping), // Filtra mensagens de digitação para a UI
    isLoading,
    isTyping,
    error,
    hasMessages,
    messageCount,
    isBackendConnected,

    // Ações
    sendMessage,
    clearHistory,
    clearError,
    startNewSession,
    refreshChatService,
    loadExternalMessages,
    setSession,
    updateMessageAttachment,

    // Utilitários
    chatService,
    currentSessionId
  };
};
