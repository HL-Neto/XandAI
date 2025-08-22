import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de formulário de login
 * @param {Object} props - Props do componente
 * @param {Function} props.onSwitchToRegister - Callback para alternar para registro
 * @param {Function} props.onLoginSuccess - Callback para login bem-sucedido
 */
const LoginForm = ({ onSwitchToRegister, onLoginSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  /**
   * Manipula mudanças nos campos do formulário
   * @param {Event} event - Evento de mudança
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa erro ao digitar
    if (error) {
      setError('');
    }
  };

  /**
   * Manipula envio do formulário
   * @param {Event} event - Evento de envio
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validação básica
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    try {
      await login(formData);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  /**
   * Valida formato do email
   * @param {string} email - Email a ser validado
   * @returns {boolean} - Se o email é válido
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Alterna visibilidade da senha
   */
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Estilo simples e uniforme
  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      height: '56px',
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
    }
  };

  return (
    <Fade in timeout={600}>
      <Card
        elevation={0}
        sx={{
          maxWidth: { xs: '100%', sm: 420, md: 450 },
          width: '100%',
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          borderRadius: { xs: 2, sm: 3 },
          border: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)`
            : `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            '&:last-child': { pb: { xs: 3, sm: 4, md: 5 } }
          }}
        >
          {/* Cabeçalho */}
          <Slide direction="down" in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    background: `linear-gradient(145deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                    border: `2px solid ${theme.palette.primary.main}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LoginIcon 
                    sx={{ 
                      fontSize: { xs: 32, sm: 40 },
                      color: theme.palette.primary.main,
                    }} 
                  />
                </Box>
              </Box>
              
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Bem-vindo de volta
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  opacity: 0.8
                }}
              >
                Entre na sua conta do XandAI
              </Typography>
            </Box>
          </Slide>

          {/* Formulário - Container com largura fixa */}
          <Slide direction="up" in timeout={1000}>
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{
                width: '100%',
                maxWidth: '400px',
                mx: 'auto'
              }}
            >
              {/* Alert de erro */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Campos com largura fixa */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Email */}
                <TextField
                  name="email"
                  type="email"
                  label="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  sx={{ ...inputSx, width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Senha */}
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  sx={{ ...inputSx, width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} size="small">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

              </Box>

              {/* Botão de login */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <ArrowForwardIcon />}
                sx={{
                  mb: 3,
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    boxShadow: `0 12px 35px ${theme.palette.primary.main}60`,
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  '&.Mui-disabled': {
                    background: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                    boxShadow: 'none',
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              {/* Link para registro */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Não tem uma conta?
                </Typography>
                <Button
                  variant="text"
                  onClick={onSwitchToRegister}
                  disabled={isLoading}
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Criar conta gratuita
                </Button>
              </Box>
            </Box>
          </Slide>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default LoginForm;
