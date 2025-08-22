import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme
} from '@mui/material';
import {
  SmartToy as BotIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AuthPage from './AuthPage';

/**
 * Componente que protege rotas baseado na autenticação
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem protegidos
 */
const AuthGuard = ({ children }) => {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Tela de loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <BotIcon
          sx={{
            fontSize: 64,
            color: theme.palette.primary.main,
            mb: 2,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          XandAI
        </Typography>
        
        <CircularProgress
          size={32}
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          Verificando autenticação...
        </Typography>

        {/* CSS para animação de pulse */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      </Box>
    );
  }

  // Se não está autenticado, mostra página de autenticação
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Se está autenticado, renderiza os componentes filhos
  return children;
};

export default AuthGuard;
