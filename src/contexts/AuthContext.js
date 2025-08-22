import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';

/**
 * Contexto de autenticação para gerenciar estado global do usuário
 */
const AuthContext = createContext({});

/**
 * Hook para usar o contexto de autenticação
 * @returns {Object} - Estado e funções de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

/**
 * Provider do contexto de autenticação
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Verifica se o usuário está autenticado na inicialização
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.isAuthenticated()) {
          // Verifica se o token ainda é válido
          const isValid = await authService.verifyToken();
          if (isValid) {
            setUser(authService.getCurrentUser());
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Realiza login do usuário
   * @param {Object} credentials - Email e senha
   * @returns {Promise<Object>} - Dados do usuário
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const authData = await authService.login(credentials);
      setUser(authData.user);
      setIsAuthenticated(true);
      return authData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} - Dados do usuário
   */
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const authData = await authService.register(userData);
      setUser(authData.user);
      setIsAuthenticated(true);
      return authData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza logout do usuário
   */
  const logout = () => {
    handleLogout();
  };

  /**
   * Atualiza o perfil do usuário
   * @param {Object} profileData - Dados do perfil
   * @returns {Promise<Object>} - Dados atualizados
   */
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Altera a senha do usuário
   * @param {Object} passwordData - Dados da senha
   * @returns {Promise<void>}
   */
  const changePassword = async (passwordData) => {
    try {
      await authService.changePassword(passwordData);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Recarrega os dados do perfil do usuário
   * @returns {Promise<Object>} - Dados do perfil
   */
  const refreshProfile = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.message === 'Sessão expirada') {
        handleLogout();
      }
      throw error;
    }
  };

  /**
   * Manipula o logout interno
   * @private
   */
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Verifica periodicamente se o token ainda é válido
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenPeriodically = async () => {
      try {
        const isValid = await authService.verifyToken();
        if (!isValid) {
          console.warn('Token expirado detectado - fazendo logout automático');
          handleLogout();
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        handleLogout();
      }
    };

    // Verifica a cada 5 minutos
    const interval = setInterval(checkTokenPeriodically, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /**
   * Verifica se o usuário tem uma role específica
   * @param {string} role - Role a ser verificada
   * @returns {boolean} - Se o usuário tem a role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Verifica se o usuário é admin
   * @returns {boolean} - Se é admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  /**
   * Obtém o nome completo do usuário
   * @returns {string} - Nome completo
   */
  const getFullName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  /**
   * Obtém as iniciais do usuário
   * @returns {string} - Iniciais
   */
  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const contextValue = {
    // Estado
    user,
    isLoading,
    isAuthenticated,

    // Ações de autenticação
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,

    // Utilitários
    hasRole,
    isAdmin,
    getFullName,
    getInitials,

    // Serviço (para uso avançado)
    authService,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
