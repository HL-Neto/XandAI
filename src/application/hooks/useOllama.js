import { useState, useEffect, useCallback } from 'react';
import { OllamaService } from '../services/OllamaService.js';

/**
 * Hook personalizado para gerenciar o estado do OLLAMA
 * @returns {Object} - Estado e funções do OLLAMA
 */
export const useOllama = () => {
  const [config, setConfig] = useState(null);
  const [models, setModels] = useState([]);
  const [serviceStatus, setServiceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ollamaService] = useState(() => new OllamaService());

  /**
   * Carrega a configuração inicial
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currentConfig = await ollamaService.getConfiguration();
        setConfig(currentConfig);
        
        // Sempre tenta carregar status e modelos para mostrar na UI
        await refreshServiceStatus();
        if (currentConfig.enabled) {
          await refreshModels();
        }
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
        setError('Falha ao carregar configuração inicial');
      }
    };

    loadInitialData();
  }, [ollamaService]);

  /**
   * Recarrega dados quando a configuração muda
   */
  useEffect(() => {
    if (config && config.enabled) {
      const reloadData = async () => {
        await refreshServiceStatus();
        await refreshModels();
      };
      reloadData();
    }
  }, [config?.enabled, config?.baseUrl, config?.selectedModel]);

  /**
   * Atualiza o status do serviço
   */
  const refreshServiceStatus = useCallback(async () => {
    try {
      const status = await ollamaService.checkServiceStatus();
      setServiceStatus(status);
      return status;
    } catch (err) {
      console.error('Erro ao verificar status do serviço:', err);
      setServiceStatus({
        isConnected: false,
        isConfigured: false,
        error: err.message
      });
      return null;
    }
  }, [ollamaService]);

  /**
   * Atualiza a lista de modelos
   */
  const refreshModels = useCallback(async () => {
    if (!config?.enabled) {
      setModels([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const modelsList = await ollamaService.listAvailableModels();
      setModels(modelsList);
      return modelsList;
    } catch (err) {
      console.error('Erro ao carregar modelos:', err);
      setError('Falha ao carregar lista de modelos');
      setModels([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, config?.enabled]);

  /**
   * Atualiza a configuração
   * @param {Object} updates - Atualizações para aplicar
   */
  const updateConfig = useCallback(async (updates) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedConfig = await ollamaService.updateConfiguration(updates);
      setConfig(updatedConfig);

      // Se habilitou a integração, atualiza status e modelos
      if (updates.enabled) {
        await refreshServiceStatus();
        await refreshModels();
      } else if (updates.enabled === false) {
        // Se desabilitou, limpa dados
        setServiceStatus(null);
        setModels([]);
      }

      return updatedConfig;
    } catch (err) {
      console.error('Erro ao atualizar configuração:', err);
      setError(err.message || 'Falha ao atualizar configuração');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, refreshServiceStatus, refreshModels]);

  /**
   * Testa a conexão com uma URL específica
   * @param {string} baseUrl - URL para testar
   */
  const testConnection = useCallback(async (baseUrl = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ollamaService.testConnection(baseUrl);
      return result;
    } catch (err) {
      console.error('Erro ao testar conexão:', err);
      setError(err.message || 'Falha ao testar conexão');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService]);

  /**
   * Seleciona um modelo
   * @param {string} modelName - Nome do modelo
   */
  const selectModel = useCallback(async (modelName) => {
    setIsLoading(true);
    setError(null);

    try {
      await ollamaService.selectModel(modelName);
      
      // Atualiza a configuração local
      const updatedConfig = await ollamaService.getConfiguration();
      setConfig(updatedConfig);
      
      // Atualiza o status do serviço
      await refreshServiceStatus();
      
      return modelName;
    } catch (err) {
      console.error('Erro ao selecionar modelo:', err);
      setError(err.message || 'Falha ao selecionar modelo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, refreshServiceStatus]);

  /**
   * Envia uma mensagem usando OLLAMA
   * @param {string} message - Mensagem para enviar
   * @param {Object} options - Opções adicionais
   */
  const sendMessage = useCallback(async (message, options = {}) => {
    if (!config?.enabled || !config?.selectedModel) {
      throw new Error('OLLAMA não está configurado adequadamente');
    }

    setError(null);

    try {
      const response = await ollamaService.sendMessage(message, options);
      return response;
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError(err.message || 'Falha ao enviar mensagem');
      throw err;
    }
  }, [ollamaService, config]);

  /**
   * Baixa um modelo
   * @param {string} modelName - Nome do modelo
   * @param {Function} onProgress - Callback de progresso
   */
  const downloadModel = useCallback(async (modelName, onProgress = null) => {
    setIsLoading(true);
    setError(null);

    try {
      await ollamaService.downloadModel(modelName, onProgress);
      
      // Atualiza a lista de modelos após download
      await refreshModels();
      
      return true;
    } catch (err) {
      console.error('Erro ao baixar modelo:', err);
      setError(err.message || 'Falha ao baixar modelo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, refreshModels]);

  /**
   * Remove um modelo
   * @param {string} modelName - Nome do modelo
   */
  const removeModel = useCallback(async (modelName) => {
    setIsLoading(true);
    setError(null);

    try {
      await ollamaService.removeModel(modelName);
      
      // Se era o modelo selecionado, limpa a seleção
      if (config?.selectedModel === modelName) {
        await updateConfig({ selectedModel: '' });
      }
      
      // Atualiza a lista de modelos
      await refreshModels();
      
      return true;
    } catch (err) {
      console.error('Erro ao remover modelo:', err);
      setError(err.message || 'Falha ao remover modelo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollamaService, config?.selectedModel, updateConfig, refreshModels]);

  /**
   * Habilita/desabilita a integração
   * @param {boolean} enabled - Se deve habilitar
   */
  const toggleIntegration = useCallback(async (enabled) => {
    return await updateConfig({ enabled });
  }, [updateConfig]);

  /**
   * Limpa o erro atual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Verifica se o OLLAMA está pronto para uso
   */
  const isReady = config?.enabled && 
                  config?.selectedModel && 
                  serviceStatus?.isConnected &&
                  serviceStatus?.isConfigured;

  /**
   * Obtém estatísticas gerais
   */
  const getStats = useCallback(() => {
    return {
      totalModels: models.length,
      isConfigured: !!config?.enabled,
      isConnected: !!serviceStatus?.isConnected,
      selectedModel: config?.selectedModel || null,
      lastChecked: serviceStatus?.lastChecked || null
    };
  }, [models.length, config, serviceStatus]);

  return {
    // Estado
    config,
    models,
    serviceStatus,
    isLoading,
    error,
    isReady,

    // Ações de configuração
    updateConfig,
    testConnection,
    toggleIntegration,

    // Ações de modelos
    refreshModels,
    selectModel,
    downloadModel,
    removeModel,

    // Ações de comunicação
    sendMessage,

    // Ações de status
    refreshServiceStatus,

    // Utilitários
    clearError,
    getStats,
    
    // Serviço (para uso avançado)
    ollamaService
  };
};
