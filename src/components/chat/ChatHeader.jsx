import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  SmartToy as BotIcon,
  Circle as OnlineIcon,
  Refresh as RefreshIcon,
  ClearAll as ClearIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import ModelSelector from './ModelSelector';

/**
 * Componente do cabeçalho do chat
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onMenuClick - Callback para abrir menu
 * @param {Function} props.onClearChat - Callback para limpar chat
 * @param {Function} props.onRefresh - Callback para atualizar
 * @param {Function} props.onSettings - Callback para abrir configurações
 * @param {number} props.messageCount - Número de mensagens
 * @param {boolean} props.isTyping - Se está digitando
 * @returns {JSX.Element}
 */
const ChatHeader = ({ 
  onMenuClick, 
  onClearChat, 
  onRefresh,
  onSettings,
  messageCount = 0,
  isTyping = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Status do bot
  const botStatus = isTyping ? 'digitando...' : 'online';
  const statusColor = isTyping ? 'warning' : 'success';

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Botão de menu (mobile) */}
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Avatar e informações do bot */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
          {/* Avatar do XandAI */}
          <Avatar
            sx={{
              backgroundColor: theme.palette.primary.main,
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
            }}
          >
            <BotIcon />
          </Avatar>

          {/* Informações */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                fontWeight: 600,
                fontSize: isMobile ? '1rem' : '1.25rem',
                lineHeight: 1.2
              }}
            >
              XandAI
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              {/* Status online */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <OnlineIcon 
                  sx={{ 
                    fontSize: 8, 
                    color: theme.palette[statusColor].main 
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {botStatus}
                </Typography>
              </Box>

              {/* Contador de mensagens (apenas em desktop) */}
              {!isMobile && messageCount > 0 && (
                <Chip
                  label={`${messageCount} mensagens`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Seletor de modelo */}
        {!isMobile && (
          <Box sx={{ mr: 2 }}>
            <ModelSelector onOpenSettings={onSettings} />
          </Box>
        )}

        {/* Ações do header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Botão de configurações */}
          <Tooltip title="Configurações">
            <IconButton
              color="inherit"
              onClick={onSettings}
              size={isMobile ? 'small' : 'medium'}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Botão de atualizar */}
          <Tooltip title="Atualizar chat">
            <IconButton
              color="inherit"
              onClick={onRefresh}
              size={isMobile ? 'small' : 'medium'}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* Botão de limpar chat */}
          {messageCount > 0 && (
            <Tooltip title="Limpar conversa">
              <IconButton
                color="inherit"
                onClick={onClearChat}
                size={isMobile ? 'small' : 'medium'}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Botão de mais opções */}
          <Tooltip title="Mais opções">
            <IconButton
              color="inherit"
              size={isMobile ? 'small' : 'medium'}
            >
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Barra de progresso para digitação */}
      {isTyping && (
        <Box
          sx={{
            height: 2,
            backgroundColor: theme.palette.warning.main,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
    </AppBar>
  );
};

export default ChatHeader;
