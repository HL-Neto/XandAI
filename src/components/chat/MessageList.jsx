import React, { useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Paper
} from '@mui/material';
import {
  ChatBubbleOutline as ChatIcon,
  Lightbulb as TipIcon
} from '@mui/icons-material';
import ChatMessage from './ChatMessage';

/**
 * Componente para exibir a lista de mensagens do chat
 * @param {Object} props - Propriedades do componente
 * @param {Message[]} props.messages - Array de mensagens
 * @param {boolean} props.isLoading - Se está carregando
 * @param {boolean} props.isTyping - Se está digitando
 * @returns {JSX.Element}
 */
const MessageList = ({ messages = [], isLoading = false, isTyping = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Scroll automático para a última mensagem
   */
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Efeito para scroll automático quando novas mensagens chegam
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  /**
   * Verifica se deve mostrar o avatar baseado na mensagem anterior
   * @param {number} index - Índice da mensagem atual
   * @returns {boolean}
   */
  const shouldShowAvatar = (index) => {
    if (index === 0) return true;
    
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    
    return currentMessage.sender !== previousMessage.sender;
  };

  /**
   * Verifica se deve mostrar o divisor de data
   * @param {number} index - Índice da mensagem atual
   * @returns {boolean}
   */
  const shouldShowDateDivider = (index) => {
    if (index === 0) return true;
    
    const currentMessage = messages[index];
    const previousMessage = messages[index - 1];
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  /**
   * Formata a data para o divisor
   * @param {Date} date - Data a ser formatada
   * @returns {string}
   */
  const formatDateDivider = (date) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const messageDate = new Date(date).toDateString();
    
    if (messageDate === today) return 'Hoje';
    if (messageDate === yesterday) return 'Ontem';
    
    return new Date(date).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Componente de boas-vindas quando não há mensagens
  const WelcomeMessage = () => (
    <Fade in={true} timeout={800}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 4,
        gap: 3
      }}>
        {/* Logo/Ícone principal */}
        <Paper
          sx={{
            p: 3,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: theme.shadows[3],
          }}
        >
          <ChatIcon sx={{ fontSize: 48 }} />
        </Paper>

        {/* Título de boas-vindas */}
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 1
            }}
          >
            Olá! Eu sou o XandAI 👋
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 400 }}
          >
            Seu assistente virtual inteligente. Estou aqui para te ajudar com suas dúvidas, 
            conversas e muito mais!
          </Typography>
        </Box>

        {/* Dicas de uso */}
        <Paper 
          sx={{ 
            p: 2, 
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            maxWidth: 400,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TipIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight={500}>
              Dicas para começar:
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            • Faça qualquer pergunta que eu tentarei ajudar<br/>
            • Converse sobre seus interesses<br/>
            • Peça ajuda com programação ou tecnologia<br/>
            • Use linguagem natural, seja você mesmo!
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );

  // Componente de divisor de data
  const DateDivider = ({ date }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      my: 2,
      px: isMobile ? 1 : 2
    }}>
      <Divider sx={{ flex: 1 }} />
      <Typography 
        variant="caption" 
        sx={{ 
          mx: 2, 
          px: 1.5,
          py: 0.5,
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
          fontWeight: 500
        }}
      >
        {formatDateDivider(date)}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  );

  // Estilo do container principal
  const containerStyle = {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.chat || theme.palette.background.default,
  };

  // Estilo da lista de mensagens
  const listStyle = {
    flex: 1,
    overflow: 'auto',
    p: 0,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.divider,
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: theme.palette.text.disabled,
      },
    },
  };

  return (
    <Box sx={containerStyle} ref={containerRef}>
      {messages.length === 0 ? (
        <WelcomeMessage />
      ) : (
        <List sx={listStyle}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {/* Divisor de data */}
              {shouldShowDateDivider(index) && (
                <DateDivider date={message.timestamp} />
              )}
              
              {/* Mensagem */}
              <ListItem sx={{ p: 0, display: 'block' }}>
                <ChatMessage 
                  message={message} 
                  showAvatar={shouldShowAvatar(index)}
                />
              </ListItem>
            </React.Fragment>
          ))}
          
          {/* Elemento para scroll automático */}
          <div ref={messagesEndRef} />
        </List>
      )}
    </Box>
  );
};

export default MessageList;
