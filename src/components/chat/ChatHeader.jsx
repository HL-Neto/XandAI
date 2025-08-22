import React, { useState } from 'react';
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
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  SmartToy as BotIcon,
  Circle as OnlineIcon,
  Refresh as RefreshIcon,
  ClearAll as ClearIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import ModelSelector from './ModelSelector';
import { useAuth } from '../../contexts/AuthContext';

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
  const { user, logout, getFullName, getInitials } = useAuth();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  // Status do bot
  const botStatus = isTyping ? 'digitando...' : 'online';
  const statusColor = isTyping ? 'warning' : 'success';

  /**
   * Abre o menu do usuário
   */
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  /**
   * Fecha o menu do usuário
   */
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  /**
   * Manipula logout do usuário
   */
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  /**
   * Manipula abertura de perfil
   */
  const handleProfile = () => {
    handleUserMenuClose();
    // TODO: Implementar página de perfil
    console.log('Abrir perfil');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Botão de menu */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>

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

          {/* Avatar do usuário */}
          <Tooltip title={`${getFullName()} - Clique para opções`}>
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              size={isMobile ? 'small' : 'medium'}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  backgroundColor: theme.palette.secondary.main,
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                }}
                src={user?.avatar}
              >
                {getInitials()}
              </Avatar>
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

      {/* Menu do usuário */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Informações do usuário */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {getFullName()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        {/* Opções do menu */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Meu Perfil
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={onSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Configurações
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Sair
          </ListItemText>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default ChatHeader;
