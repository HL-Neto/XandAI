import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  MoreHoriz as TypingIcon
} from '@mui/icons-material';

/**
 * Componente para exibir uma mensagem individual no chat
 * @param {Object} props - Propriedades do componente
 * @param {Message} props.message - Objeto da mensagem
 * @param {boolean} props.showAvatar - Se deve mostrar o avatar
 * @returns {JSX.Element}
 */
const ChatMessage = ({ message, showAvatar = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Verifica se message tem os métodos necessários, senão usa fallback
  const isUser = message.isFromUser ? message.isFromUser() : message.sender === 'user';
  const isTyping = message.isTyping || false;
  const isStreaming = message.isStreaming || false;

  // Estilo base da mensagem
  const messageBoxStyle = {
    display: 'flex',
    flexDirection: isUser ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    gap: 1,
    mb: 2,
    px: isMobile ? 1 : 2,
  };

  // Estilo do balão da mensagem
  const messageBubbleStyle = {
    maxWidth: isMobile ? '85%' : '70%',
    minWidth: '120px',
    p: isTyping ? 1.5 : 2,
    borderRadius: 2,
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
    position: 'relative',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    ...(isTyping && {
      animation: 'pulse 1.5s ease-in-out infinite',
    }),
  };

  // Estilo do avatar
  const avatarStyle = {
    width: isMobile ? 32 : 40,
    height: isMobile ? 32 : 40,
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
    ...(showAvatar ? {} : { visibility: 'hidden' }),
  };

  // Componente de indicador de digitação
  const TypingIndicator = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <TypingIcon 
        sx={{ 
          fontSize: 16, 
          animation: 'bounce 1s ease-in-out infinite',
          color: theme.palette.text.secondary 
        }} 
      />
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        XandAI está digitando...
      </Typography>
    </Box>
  );

  // Componente de cursor de streaming
  const StreamingCursor = () => (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        width: '2px',
        height: '1em',
        backgroundColor: theme.palette.primary.main,
        animation: 'blink 1s infinite',
        marginLeft: '1px',
        verticalAlign: 'baseline',
      }}
    />
  );

  return (
    <>
      {/* Estilos CSS para animações */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-3px); }
            60% { transform: translateY(-2px); }
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>

      <Box sx={messageBoxStyle}>
        {/* Avatar */}
        <Avatar sx={avatarStyle}>
          {isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>

        {/* Balão da mensagem */}
        <Paper sx={messageBubbleStyle} elevation={0}>
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <>
              {/* Conteúdo da mensagem */}
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {message.content}
                {isStreaming && <StreamingCursor />}
              </Typography>

              {/* Informações da mensagem */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 1,
                gap: 1
              }}>
                {/* Nome do remetente */}
                <Chip
                  label={isUser ? 'Você' : 'XandAI'}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    borderColor: isUser ? 'rgba(255,255,255,0.3)' : theme.palette.divider,
                    color: isUser ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
                  }}
                />

                {/* Horário */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: isUser ? 'rgba(255,255,255,0.7)' : theme.palette.text.secondary,
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}
                >
                  {message.getFormattedTime ? message.getFormattedTime() : new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ChatMessage;
