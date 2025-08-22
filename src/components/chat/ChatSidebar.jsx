import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  Fade,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ChatBubbleOutline as ChatIcon,
  Add as AddIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente da sidebar com histórico de conversas
 * @param {Object} props - Props do componente
 * @param {boolean} props.open - Se a sidebar está aberta
 * @param {Function} props.onClose - Callback para fechar a sidebar
 * @param {Function} props.onNewChat - Callback para iniciar novo chat
 * @param {Array} props.chatHistory - Lista de conversas do histórico
 * @param {Function} props.onSelectChat - Callback para selecionar uma conversa
 * @param {Function} props.onSearchChats - Callback para buscar conversas
 * @param {Function} props.onEditTitle - Callback para editar título
 * @param {Function} props.onDeleteChat - Callback para excluir conversa
 * @param {string} props.currentChatId - ID da conversa atual
 * @param {boolean} props.isLoading - Se está carregando o histórico
 * @param {boolean} props.isLoadingSession - Se está carregando uma sessão
 */
const ChatSidebar = ({ 
  open, 
  onClose, 
  onNewChat, 
  chatHistory = [], 
  onSelectChat,
  onSearchChats,
  onEditTitle,
  onDeleteChat,
  currentChatId,
  isLoading = false,
  isLoadingSession = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, getFullName } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Filtrar conversas baseado na pesquisa
  const filteredChats = chatHistory.filter(chat =>
    chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar conversas por data
  const groupedChats = filteredChats.reduce((groups, chat) => {
    const date = new Date(chat.updatedAt || chat.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ontem';
    } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
      groupKey = 'Últimos 7 dias';
    } else if (date.getTime() > today.getTime() - 30 * 24 * 60 * 60 * 1000) {
      groupKey = 'Últimos 30 dias';
    } else {
      groupKey = 'Mais antigo';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(chat);
    return groups;
  }, {});

  /**
   * Manipula o início da edição de título
   */
  const handleStartEdit = (chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title || 'Nova conversa');
  };

  /**
   * Manipula o salvamento do título editado
   */
  const handleSaveEdit = async () => {
    if (editingId && onEditTitle) {
      try {
        await onEditTitle(editingId, editTitle);
        setEditingId(null);
        setEditTitle('');
      } catch (error) {
        console.error('Erro ao salvar título:', error);
      }
    }
  };

  /**
   * Manipula o cancelamento da edição
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  /**
   * Manipula a exclusão de uma conversa
   */
  const handleDeleteChatLocal = async (chatId) => {
    if (onDeleteChat) {
      try {
        await onDeleteChat(chatId);
      } catch (error) {
        console.error('Erro ao excluir conversa:', error);
      }
    }
  };

  /**
   * Manipula a busca com debounce
   */
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Debounce da busca
    if (onSearchChats) {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        onSearchChats(value);
      }, 300);
    }
  };

  /**
   * Formata a data de uma conversa
   */
  const formatChatTime = (date) => {
    const chatDate = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now - chatDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Agora';
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else {
      return chatDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  // Sidebar style
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: { xs: '100vw', md: '320px' },
    height: '100vh',
    zIndex: 1300,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
  };

  // Overlay para mobile
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1299,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && (
        <Box sx={overlayStyle} onClick={onClose} />
      )}

      {/* Sidebar */}
      <Paper sx={sidebarStyle} elevation={3}>
        
        {/* Header da sidebar */}
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" fontWeight={600}>
              Histórico
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Nova conversa">
              <IconButton onClick={onNewChat} size="small">
                <AddIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Fechar">
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* User info */}
        <Box sx={{ 
          p: 2, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}>
          <Typography variant="body2" color="text.secondary">
            Logado como
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            {getFullName()}
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.background.default,
              }
            }}
          />
        </Box>

        {/* Chat list */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : Object.keys(groupedChats).length === 0 ? (
            // Empty state
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              color: theme.palette.text.secondary 
            }}>
              <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body2">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {searchTerm ? 'Tente buscar por outros termos' : 'Inicie uma nova conversa'}
              </Typography>
            </Box>
          ) : (
            // Chat groups
            Object.entries(groupedChats).map(([groupName, chats]) => (
              <Box key={groupName}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    p: 2, 
                    pb: 1, 
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}
                >
                  {groupName}
                </Typography>
                
                <List sx={{ pt: 0 }}>
                  {chats.map((chat) => (
                    <ListItem key={chat.id} disablePadding>
                      <ListItemButton
                        selected={chat.id === currentChatId}
                        onClick={() => onSelectChat(chat)}
                        sx={{
                          mx: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          '&.Mui-selected': {
                            backgroundColor: `${theme.palette.primary.main}15`,
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.main}20`,
                            },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ChatIcon 
                            sx={{ 
                              fontSize: 18,
                              color: chat.id === currentChatId 
                                ? theme.palette.primary.main 
                                : theme.palette.text.secondary 
                            }} 
                          />
                        </ListItemIcon>
                        
                        <ListItemText
                          primary={
                            editingId === chat.id ? (
                              <TextField
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit();
                                  if (e.key === 'Escape') handleCancelEdit();
                                }}
                                size="small"
                                autoFocus
                                sx={{ width: '100%' }}
                              />
                            ) : (
                              <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {chat.title || 'Nova conversa'}
                              </Typography>
                            )
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  flex: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  opacity: 0.7
                                }}
                              >
                                {chat.preview || 'Sem prévia'}
                              </Typography>
                              
                              <Chip 
                                label={formatChatTime(chat.updatedAt || chat.createdAt)}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.6rem',
                                  height: 16,
                                  opacity: 0.6
                                }}
                              />
                            </Box>
                          }
                        />
                        
                        {!editingId && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Editar título">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(chat);
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Excluir conversa">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChatLocal(chat.id);
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ mx: 2, my: 1 }} />
              </Box>
            ))
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default
        }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onNewChat}
            sx={{ borderRadius: 2 }}
          >
            Nova Conversa
          </Button>
        </Box>

      </Paper>
    </>
  );
};

export default ChatSidebar;
