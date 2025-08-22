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
   * Handles message sending
   * @param {string} message - Message to be sent
   */
  const handleSendMessage = async (message) => {
    try {
      // If there's no current session in chat, create a new one
      if (!chatCurrentSessionId && !currentSession) {
        const newSession = await createNewSession();
        if (newSession && newSession.id) {
          setSession(newSession.id);

        }
      }
      
      await sendMessage(message);
      
      // Update history after sending message
      setTimeout(() => {
        fetchChatSessions();
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  /**
   * Handles history clearing
   */
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setClearDialogOpen(false);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  /**
   * Handles confirmation dialog opening
   */
  const handleClearDialogOpen = () => {
    setClearDialogOpen(true);
  };

  /**
   * Handles confirmation dialog closing
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
   * Handles error closing
   */
  const handleCloseError = () => {
    clearError();
  };

  /**
   * Handles settings opening
   */
  const handleOpenSettings = () => {
    setSettingsDialogOpen(true);
  };

  /**
   * Handles settings closing
   */
  const handleCloseSettings = () => {
    setSettingsDialogOpen(false);
  };

  /**
   * Handles sidebar opening/closing
   */
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  /**
   * Handles sidebar closing
   */
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  /**
   * Handles starting a new conversation
   */
  const handleNewChat = async () => {
    try {
      const newSession = await createNewSession();
      clearHistory(); // Clear current messages
      
      // Set new session as active
      if (newSession && newSession.id) {
        setSession(newSession.id);

      }
      
      setSidebarOpen(false);
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  };

  /**
   * Handles selection of a conversation from history
   */
  const handleSelectChat = async (chat) => {
    try {

      const session = await loadChatSession(chat.id);

      
      if (session) {
        // Set current session in useChat
        setSession(session.id);
        
        if (session.messages && session.messages.length > 0) {
          // Load session messages into current chat

          loadExternalMessages(session.messages, session.id);

        } else {
          // Session without messages, just clear chat and set session
          loadExternalMessages([], session.id);

        }
      } else {

      }
      setSidebarOpen(false);
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  /**
   * Handles conversation search
   */
  const handleSearchChats = async (query) => {
    try {
      await searchChatSessions(query);
    } catch (err) {
      console.error('Error searching conversations:', err);
    }
  };

  /**
   * Handles image generation
   */
  const handleImageGenerated = (messageId, attachment) => {
    if (updateMessageAttachment) {
      updateMessageAttachment(messageId, attachment);
    }
  };

  /**
   * Handles title editing
   */
  const handleEditTitle = async (sessionId, newTitle) => {
    try {
      await updateSessionTitle(sessionId, newTitle);
    } catch (err) {
      console.error('Error editing title:', err);
    }
  };

  /**
   * Handles conversation deletion
   */
  const handleDeleteChat = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  /**
   * Handles history errors
   */
  const handleCloseHistoryError = () => {
    clearHistoryError();
  };

  // Main container style
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
  };

  // Chat area style (main)
  const chatAreaStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: sidebarOpen && !isMobile ? '320px' : 0,
    transition: 'margin-left 0.3s ease-in-out',
  };

  // Main paper style (no border radius)
  const paperStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0, // Removido border radius
    overflow: 'hidden',
    boxShadow: 'none', // Removido shadow
    backgroundColor: theme.palette.background.paper,
  };

  // Messages area style
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

      {/* Main chat area */}
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

          {/* Messages area */}
          <Box sx={messagesAreaStyle}>
            <MessageList
              messages={messages}
              isLoading={isLoading}
              isTyping={isTyping}
              onImageGenerated={handleImageGenerated}
            />
          </Box>

          {/* Message input */}
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

      {/* Confirmation dialog to clear chat */}
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

      {/* Settings dialog */}
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={handleCloseSettings}
      />

      {/* Snackbar for errors */}
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

      {/* Snackbar for history errors */}
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
