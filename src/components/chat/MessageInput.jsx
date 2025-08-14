import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon
} from '@mui/icons-material';

/**
 * Componente de entrada de mensagem
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSendMessage - Callback para enviar mensagem
 * @param {boolean} props.disabled - Se o input está desabilitado
 * @param {boolean} props.isLoading - Se está carregando
 * @param {string} props.placeholder - Placeholder do input
 * @returns {JSX.Element}
 */
const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Digite sua mensagem..."
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const inputRef = useRef(null);

  /**
   * Manipula o envio da mensagem
   */
  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Foca no input após enviar
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  /**
   * Manipula a tecla Enter
   * @param {KeyboardEvent} event - Evento do teclado
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Manipula mudanças no input
   * @param {Event} event - Evento de mudança
   */
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  /**
   * Verifica se pode enviar a mensagem
   */
  const canSend = message.trim().length > 0 && !disabled && !isLoading;

  // Estilo do container principal
  const containerStyle = {
    p: isMobile ? 1 : 2,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
  };

  // Estilo do paper que contém o input
  const inputPaperStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    p: 1,
    borderRadius: 3,
    border: `2px solid ${isFocused ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    transition: 'border-color 0.2s ease-in-out',
    gap: 1,
  };

  return (
    <Box sx={containerStyle}>
      <Paper sx={inputPaperStyle} elevation={0}>
        {/* Botões de ação à esquerda (apenas em desktop) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Anexar arquivo">
              <IconButton 
                size="small" 
                disabled={disabled}
                sx={{ color: theme.palette.text.secondary }}
              >
                <AttachIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Adicionar emoji">
              <IconButton 
                size="small" 
                disabled={disabled}
                sx={{ color: theme.palette.text.secondary }}
              >
                <EmojiIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Campo de entrada de texto */}
        <TextField
          ref={inputRef}
          fullWidth
          multiline
          maxRows={4}
          variant="standard"
          placeholder={placeholder}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '1rem',
              lineHeight: 1.5,
              color: theme.palette.text.primary,
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 0.7,
              },
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
            },
            '& .MuiInputBase-input': {
              padding: '8px 0',
            },
          }}
        />

        {/* Botões de ação à direita */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Botão de microfone */}
          <Tooltip title="Mensagem de voz">
            <IconButton 
              size="small" 
              disabled={disabled}
              sx={{ color: theme.palette.text.secondary }}
            >
              <MicIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Botão de envio */}
          <Tooltip title={canSend ? "Enviar mensagem" : "Digite uma mensagem"}>
            <span>
              <IconButton
                onClick={handleSendMessage}
                disabled={!canSend}
                sx={{
                  backgroundColor: canSend ? theme.palette.primary.main : 'transparent',
                  color: canSend ? theme.palette.primary.contrastText : theme.palette.text.disabled,
                  '&:hover': {
                    backgroundColor: canSend ? theme.palette.primary.dark : 'transparent',
                  },
                  '&:disabled': {
                    backgroundColor: 'transparent',
                  },
                  transition: 'all 0.2s ease-in-out',
                  minWidth: 40,
                  minHeight: 40,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      {/* Dica de uso em mobile */}
      {isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 1 
        }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            Pressione Enter para enviar
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageInput;
