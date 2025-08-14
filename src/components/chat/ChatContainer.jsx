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
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SettingsDialog from '../settings/SettingsDialog';
import { useChat } from '../../application/hooks/useChat';

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
    clearError
  } = useChat();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  /**
   * Manipula o envio de mensagem
   * @param {string} message - Mensagem a ser enviada
   */
  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message);
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

  // Estilo do container principal
  const containerStyle = {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
  };

  // Estilo do paper principal
  const paperStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: isMobile ? 0 : 2,
    overflow: 'hidden',
    boxShadow: isMobile ? 'none' : theme.shadows[2],
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
      <Paper sx={paperStyle} elevation={isMobile ? 0 : 2}>
        {/* Cabeçalho do chat */}
        <ChatHeader
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
    </Box>
  );
};

export default ChatContainer;
