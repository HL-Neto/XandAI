import { useState, useEffect, useCallback } from 'react';
import { StableDiffusionService } from '../services/StableDiffusionService.js';

/**
 * Hook personalizado para gerenciar o estado do Stable Diffusion
 * @returns {Object} - Estado e funções do Stable Diffusion
 */
export const useStableDiffusion = () => {
  const [config, setConfig] = useState(null);
  const [models, setModels] = useState([]);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stableDiffusionService] = useState(() => new StableDiffusionService());

  /**
   * Carrega a configuração inicial
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currentConfig = await stableDiffusionService.getConfiguration();
        setConfig(currentConfig);
        
        // Sempre tenta carregar status e modelos para mostrar na UI
        await refreshServiceStatus();
        await refreshModels();
      } catch (err) {
        console.error('Erro ao carregar dados iniciais SD:', err);
        setError('Falha ao carregar configuração inicial');
      }
    };

    loadInitialData();
  }, [stableDiffusionService]);

  /**
   * Recarrega dados quando a configuração muda
   */
  useEffect(() => {
    if (config?.baseUrl) {
      const reloadData = async () => {
        await refreshServiceStatus();
        await refreshModels();
      };
      reloadData();
    }
  }, [config?.baseUrl, config?.model]);

  /**
   * Atualiza o status do serviço
   */
  const refreshServiceStatus = useCallback(async () => {
    if (!config?.baseUrl) {
      setServiceStatus({ 
        success: false, 
        message: 'URL não configurada' 
      });
      return;
    }

    try {
      setIsLoading(true);
      const status = await stableDiffusionService.testConnection();
      setServiceStatus(status);
      
      // Se há erro de autenticação, não define como erro geral
      if (status.requiresAuth) {
        setError(null); // Não é um erro técnico, é uma questão de autenticação
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao verificar status SD:', err);
      setServiceStatus({ 
        success: false, 
        message: err.message 
      });
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [stableDiffusionService, config?.baseUrl]);

  /**
   * Recarrega a lista de modelos
   */
  const refreshModels = useCallback(async () => {
    try {
      setIsLoading(true);
      const availableModels = await stableDiffusionService.getAvailableModels();
      setModels(availableModels);
      
      // Se não conseguiu buscar modelos mas não é erro de autenticação, mostra erro
      if (availableModels.length === 0 && stableDiffusionService.isAuthenticated()) {
        setError('Falha ao carregar modelos - verifique a conexão com Stable Diffusion');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao carregar modelos SD:', err);
      setError('Falha ao carregar modelos');
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  }, [stableDiffusionService]);

  /**
   * Atualiza a configuração
   * @param {Object} updates - Atualizações da configuração
   */
  const updateConfig = useCallback(async (updates) => {
    try {
      setIsLoading(true);
      const updatedConfig = await stableDiffusionService.updateConfiguration(updates);
      setConfig(updatedConfig);
      setError(null);
      
      // Re-testa conexão se a URL mudou
      if (updates.baseUrl && updates.baseUrl !== config?.baseUrl) {
        await refreshServiceStatus();
      }
      
      return updatedConfig;
    } catch (err) {
      console.error('Erro ao atualizar configuração SD:', err);
      setError('Falha ao salvar configuração');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [stableDiffusionService, config, refreshServiceStatus]);

  /**
   * Testa a conexão
   */
  const testConnection = useCallback(async () => {
    return await refreshServiceStatus();
  }, [refreshServiceStatus]);

  /**
   * Gera uma imagem
   * @param {string} prompt - Prompt para geração
   * @param {Object} options - Opções adicionais
   */
  const generateImage = useCallback(async (prompt, options = {}) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const result = await stableDiffusionService.generateImage(prompt, options);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result;
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [stableDiffusionService]);

  /**
   * Seleciona um modelo
   * @param {string} modelName - Nome do modelo
   */
  const selectModel = useCallback(async (modelName) => {
    try {
      await updateConfig({ model: modelName });
    } catch (err) {
      console.error('Erro ao selecionar modelo SD:', err);
      throw err;
    }
  }, [updateConfig]);

  /**
   * Habilita/desabilita a integração
   * @param {boolean} enabled - Se deve habilitar
   */
  const toggleIntegration = useCallback(async (enabled) => {
    try {
      await updateConfig({ enabled });
    } catch (err) {
      console.error('Erro ao alterar status SD:', err);
      throw err;
    }
  }, [updateConfig]);

  /**
   * Interrompe geração em andamento
   */
  const interruptGeneration = useCallback(async () => {
    try {
      const success = await stableDiffusionService.interruptGeneration();
      if (success) {
        setIsGenerating(false);
      }
      return success;
    } catch (err) {
      console.error('Erro ao interromper geração:', err);
      return false;
    }
  }, [stableDiffusionService]);

  return {
    // Estados
    config,
    models,
    serviceStatus,
    isLoading,
    error,
    isGenerating,
    
    // Funções
    updateConfig,
    testConnection,
    refreshModels,
    refreshServiceStatus,
    generateImage,
    selectModel,
    toggleIntegration,
    interruptGeneration,
    
    // Serviço (para uso avançado)
    stableDiffusionService
  };
};
