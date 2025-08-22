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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Grid,
  Fade,
  Slide,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  ArrowForward as ArrowForwardIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de formulário de registro
 * @param {Object} props - Props do componente
 * @param {Function} props.onSwitchToLogin - Callback para alternar para login
 * @param {Function} props.onRegisterSuccess - Callback para registro bem-sucedido
 */
const RegisterForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    theme: 'dark',
    preferredLanguage: 'pt'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validação
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  /**
   * Valida o formulário
   * @returns {string|null} - Mensagem de erro ou null se válido
   */
  const validateForm = () => {
    const { email, password, confirmPassword, firstName, lastName } = formData;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return 'Por favor, preencha todos os campos obrigatórios';
    }

    if (!isValidEmail(email)) {
      return 'Por favor, insira um email válido';
    }

    if (password.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres';
    }

    if (password !== confirmPassword) {
      return 'As senhas não coincidem';
    }

    if (firstName.length < 2) {
      return 'O primeiro nome deve ter pelo menos 2 caracteres';
    }

    if (lastName.length < 2) {
      return 'O sobrenome deve ter pelo menos 2 caracteres';
    }

    return null;
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

  /**
   * Alterna visibilidade da confirmação de senha
   */
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
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
          maxWidth: { xs: '100%', sm: 520, md: 580 },
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
            background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          }
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, sm: 4, md: 5 },
            '&:last-child': { pb: { xs: 2.5, sm: 4, md: 5 } }
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
                    background: `linear-gradient(145deg, ${theme.palette.secondary.main}20, ${theme.palette.primary.main}20)`,
                    border: `2px solid ${theme.palette.secondary.main}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonAddIcon 
                    sx={{ 
                      fontSize: { xs: 32, sm: 40 },
                      color: theme.palette.secondary.main,
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
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Junte-se ao XandAI
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  opacity: 0.8
                }}
              >
                Crie sua conta e comece a conversar com IA
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
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              {/* Alert de erro */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Todos os campos com mesma largura */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Nome */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    name="firstName"
                    label="Primeiro Nome"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    sx={{ ...inputSx, width: '50%' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    name="lastName"
                    label="Sobrenome"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    sx={{ ...inputSx, width: '50%' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

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

                {/* Senhas */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Senha"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    helperText="Mínimo de 8 caracteres"
                    sx={{ ...inputSx, width: '50%' }}
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
                  <TextField
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirmar Senha"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    sx={{ ...inputSx, width: '50%' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleConfirmPasswordVisibility} size="small">
                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Preferências */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                  Preferências
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel>Tema</InputLabel>
                    <Select
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      label="Tema"
                      disabled={isLoading}
                      sx={{ height: '56px' }}
                    >
                      <MenuItem value="light">☀️ Claro</MenuItem>
                      <MenuItem value="dark">🌙 Escuro</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel>Idioma</InputLabel>
                    <Select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      label="Idioma"
                      disabled={isLoading}
                      sx={{ height: '56px' }}
                    >
                      <MenuItem value="pt">🇧🇷 Português</MenuItem>
                      <MenuItem value="en">🇺🇸 English</MenuItem>
                      <MenuItem value="es">🇪🇸 Español</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

              </Box>

              {/* Botão de registro */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                endIcon={!isLoading && <ArrowForwardIcon />}
                sx={{
                  mt: 3,
                  mb: 3,
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  boxShadow: `0 8px 25px ${theme.palette.secondary.main}40`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.dark})`,
                    boxShadow: `0 12px 35px ${theme.palette.secondary.main}60`,
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
                  'Criar Conta'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  ou
                </Typography>
              </Divider>

              {/* Link para login */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Já tem uma conta?
                </Typography>
                <Button
                  variant="text"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    color: theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.secondary.main}10`,
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Fazer login
                </Button>
              </Box>
            </Box>
          </Slide>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default RegisterForm;
