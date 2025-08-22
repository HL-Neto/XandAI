import React, { useState } from 'react';
import {
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import ChatHeader from './ChatHeader';
import ChatSidebar from './ChatSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SettingsDialog from '../settings/SettingsDialog';
import { useChat } from '../../application/hooks/useChat';
import { useChatHistory } from '../../application/hooks/useChatHistory';

/**
 * Container principal do chat
 * @returns {JSX.Element}
 */
const ChatContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    messages,
    isLoading,
    isTyping,
    error,
    hasMessages,
    messageCount,
    sendMessage,
    clearHistory,
    clearError,
    loadExternalMessages,
    setSession,
    currentSessionId: chatCurrentSessionId,
    updateMessageAttachment
  } = useChat();

  // Hook para gerenciar histórico de conversas
  const {
    chatSessions,
    currentSession,
    isLoading: isLoadingHistory,
    isLoadingSession,
    error: historyError,
    loadChatSession,
    createNewSession,
    updateSessionTitle,
    deleteChatSession,
    searchChatSessions,
    clearError: clearHistoryError,
    currentSessionId,
    hasSessions,
    fetchChatSessions
  } = useChatHistory();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Manipula o envio de mensagem
   * @param {string} message - Mensagem a ser enviada
   */
  const handleSendMessage = async (message) => {
    try {
      // Se não há sessão atual no chat, cria uma nova
      if (!chatCurrentSessionId && !currentSession) {
        const newSession = await createNewSession();
        if (newSession && newSession.id) {
          setSession(newSession.id);

        }
      }
      
      await sendMessage(message);
      
      // Atualiza o histórico após enviar a mensagem
      setTimeout(() => {
        fetchChatSessions();
      }, 1000);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  /**
   * Manipula a limpeza do histórico
   */
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setClearDialogOpen(false);
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
    }
  };

  /**
   * Manipula a abertura do dialog de confirmação
   */
  const handleClearDialogOpen = () => {
    setClearDialogOpen(true);
  };

  /**
   * Manipula o fechamento do dialog de confirmação
   */
  const handleClearDialogClose = () => {
    setClearDialogOpen(false);
  };

  /**
   * Manipula a atualização do chat
   */
  const handleRefresh = () => {
    window.location.reload();
  };

  /**
   * Manipula o fechamento do erro
   */
  const handleCloseError = () => {
    clearError();
  };

  /**
   * Manipula a abertura das configurações
   */
  const handleOpenSettings = () => {
    setSettingsDialogOpen(true);
  };

  /**
   * Manipula o fechamento das configurações
   */
  const handleCloseSettings = () => {
    setSettingsDialogOpen(false);
  };

  /**
   * Manipula a abertura/fechamento da sidebar
   */
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  /**
   * Manipula o fechamento da sidebar
   */
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * Manipula o início de uma nova conversa
   */
  const handleNewChat = async () => {
    try {
      const newSession = await createNewSession();
      clearHistory(); // Limpa as mensagens atuais
      
      // Define a nova sessão como ativa
      if (newSession && newSession.id) {
        setSession(newSession.id);

      }
      
      setSidebarOpen(false);
    } catch (err) {
      console.error('Erro ao criar nova conversa:', err);
    }
  };

  /**
   * Manipula a seleção de uma conversa do histórico
   */
  const handleSelectChat = async (chat) => {
    try {

      const session = await loadChatSession(chat.id);

      
      if (session) {
        // Define a sessão atual no useChat
        setSession(session.id);
        
        if (session.messages && session.messages.length > 0) {
          // Carrega as mensagens da sessão no chat atual

          loadExternalMessages(session.messages, session.id);

        } else {
          // Sessão sem mensagens, apenas limpa o chat e define a sessão
          loadExternalMessages([], session.id);

        }
      } else {

      }
      setSidebarOpen(false);
    } catch (err) {
      console.error('Erro ao carregar conversa:', err);
    }
  };

  /**
   * Manipula a busca de conversas
   */
  const handleSearchChats = async (query) => {
    try {
      await searchChatSessions(query);
    } catch (err) {
      console.error('Erro ao buscar conversas:', err);
    }
  };

  /**
   * Lida com a geração de imagem
   */
  const handleImageGenerated = (messageId, attachment) => {
    if (updateMessageAttachment) {
      updateMessageAttachment(messageId, attachment);
    }
  };

  /**
   * Manipula a edição de título
   */
  const handleEditTitle = async (sessionId, newTitle) => {
    try {
      await updateSessionTitle(sessionId, newTitle);
    } catch (err) {
      console.error('Erro ao editar título:', err);
    }
  };

  /**
   * Manipula a exclusão de conversa
   */
  const handleDeleteChat = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
    } catch (err) {
      console.error('Erro ao excluir conversa:', err);
    }
  };

  /**
   * Manipula erros do histórico
   */
  const handleCloseHistoryError = () => {
    clearHistoryError();
  };

  // Estilo do container principal
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
  };

  // Estilo da área do chat (principal)
  const chatAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: sidebarOpen && !isMobile ? '320px' : 0,
    transition: 'margin-left 0.3s ease-in-out',
  };

  // Estilo do paper principal (sem border radius)
  const paperStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0, // Removido border radius
    overflow: 'hidden',
    boxShadow: 'none', // Removido shadow
    backgroundColor: theme.palette.background.paper,
  };

  // Estilo da área de mensagens
  const messagesAreaStyle = {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Box sx={containerStyle}>
      {/* Sidebar */}
      <ChatSidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        onNewChat={handleNewChat}
        chatHistory={chatSessions}
        onSelectChat={handleSelectChat}
        onSearchChats={handleSearchChats}
        onEditTitle={handleEditTitle}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentSessionId}
        isLoading={isLoadingHistory}
        isLoadingSession={isLoadingSession}
      />

      {/* Área principal do chat */}
      <Box sx={chatAreaStyle}>
        <Paper sx={paperStyle} elevation={0}>
          {/* Cabeçalho do chat */}
          <ChatHeader
            onMenuClick={handleToggleSidebar}
            onClearChat={handleClearDialogOpen}
            onRefresh={handleRefresh}
            onSettings={handleOpenSettings}
            messageCount={messageCount}
            isTyping={isTyping}
          />

          {/* Área de mensagens */}
          <Box sx={messagesAreaStyle}>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              isTyping={isTyping}
              onImageGenerated={handleImageGenerated}
            />
          </Box>

          {/* Input de mensagem */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
            placeholder={
              hasMessages 
                ? "Digite sua mensagem..." 
                : "Olá! Como posso te ajudar hoje?"
            }
          />
        </Paper>
      </Box>

      {/* Dialog de confirmação para limpar chat */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleClearDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Limpar Conversa
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Tem certeza de que deseja limpar toda a conversa? 
            Esta ação não pode ser desfeita.
          </Typography>
          {messageCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {messageCount} mensagens serão removidas permanentemente.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleClearDialogClose}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleClearHistory}
            color="error"
            variant="contained"
          >
            Limpar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de configurações */}
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={handleCloseSettings}
      />

      {/* Snackbar para erros */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Snackbar para erros do histórico */}
      <Snackbar
        open={!!historyError}
        autoHideDuration={6000}
        onClose={handleCloseHistoryError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseHistoryError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {historyError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatContainer;
