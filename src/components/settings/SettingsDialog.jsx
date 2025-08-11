import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useOllama } from '../../application/hooks/useOllama';

/**
 * Dialog de configurações do OLLAMA
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Se o dialog está aberto
 * @param {Function} props.onClose - Callback para fechar
 * @returns {JSX.Element}
 */
const SettingsDialog = ({ open, onClose }) => {
  const {
    config,
    models,
    serviceStatus,
    isLoading,
    error,
    updateConfig,
    testConnection,
    refreshModels,
    selectModel,
    toggleIntegration
  } = useOllama();

  const [localConfig, setLocalConfig] = useState({
    baseUrl: 'http://localhost:11434',
    timeout: 30000,
    enabled: false,
    selectedModel: ''
  });

  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sincroniza configuração local com a global
  useEffect(() => {
    if (config) {
      setLocalConfig({
        baseUrl: config.baseUrl,
        timeout: config.timeout,
        enabled: config.enabled,
        selectedModel: config.selectedModel
      });
      setHasUnsavedChanges(false);
    }
  }, [config]);

  /**
   * Manipula mudanças nos campos de configuração
   * @param {string} field - Campo alterado
   * @param {any} value - Novo valor
   */
  const handleConfigChange = (field, value) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setTestResult(null);
  };

  /**
   * Testa a conexão com o OLLAMA
   */
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testConnection(localConfig.baseUrl);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        testedUrl: localConfig.baseUrl
      });
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * Salva as configurações
   */
  const handleSaveConfig = async () => {
    try {
      await updateConfig(localConfig);
      setHasUnsavedChanges(false);
      setTestResult(null);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    }
  };

  /**
   * Seleciona um modelo
   * @param {string} modelName - Nome do modelo
   */
  const handleSelectModel = async (modelName) => {
    try {
      await selectModel(modelName);
      setLocalConfig(prev => ({ ...prev, selectedModel: modelName }));
    } catch (error) {
      console.error('Erro ao selecionar modelo:', error);
    }
  };

  /**
   * Atualiza lista de modelos
   */
  const handleRefreshModels = async () => {
    try {
      await refreshModels();
    } catch (error) {
      console.error('Erro ao atualizar modelos:', error);
    }
  };

  /**
   * Renderiza o status da conexão
   */
  const renderConnectionStatus = () => {
    if (!serviceStatus) return null;

    const { isConnected, isConfigured, selectedModel, modelStatus } = serviceStatus;

    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Status da Conexão
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              {isConnected ? (
                <CheckIcon color="success" fontSize="small" />
              ) : (
                <ErrorIcon color="error" fontSize="small" />
              )}
              <Typography variant="body2">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box display="flex" alignItems="center" gap={1}>
              {isConfigured ? (
                <CheckIcon color="success" fontSize="small" />
              ) : (
                <ErrorIcon color="warning" fontSize="small" />
              )}
              <Typography variant="body2">
                {isConfigured ? 'Configurado' : 'Não configurado'}
              </Typography>
            </Box>
          </Grid>
          
          {selectedModel && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <MemoryIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  Modelo: {selectedModel}
                </Typography>
                <Chip 
                  size="small" 
                  label={modelStatus}
                  color={modelStatus === 'available' ? 'success' : 'warning'}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  };

  /**
   * Renderiza o resultado do teste de conexão
   */
  const renderTestResult = () => {
    if (!testResult) return null;

    return (
      <Alert 
        severity={testResult.success ? 'success' : 'error'} 
        sx={{ mt: 2 }}
        action={
          testResult.success && (
            <Typography variant="body2" color="text.secondary">
              {testResult.modelsCount} modelos encontrados
            </Typography>
          )
        }
      >
        {testResult.success ? (
          <>
            Conexão estabelecida com sucesso!
            {testResult.models && testResult.models.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Modelos disponíveis: {testResult.models.map(m => m.name).join(', ')}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          `Falha na conexão: ${testResult.error}`
        )}
      </Alert>
    );
  };

  /**
   * Renderiza a lista de modelos
   */
  const renderModelsList = () => {
    if (!models || models.length === 0) {
      return (
        <Box textAlign="center" py={3}>
          <Typography variant="body2" color="text.secondary">
            {serviceStatus?.isConnected 
              ? 'Nenhum modelo encontrado' 
              : 'Conecte ao OLLAMA para ver os modelos'
            }
          </Typography>
        </Box>
      );
    }

    return (
      <List dense>
        {models.map((model) => (
          <ListItem key={model.name} disablePadding>
            <ListItemButton
              selected={model.name === localConfig.selectedModel}
              onClick={() => handleSelectModel(model.name)}
            >
              <ListItemIcon>
                <MemoryIcon 
                  color={model.name === localConfig.selectedModel ? 'primary' : 'inherit'} 
                />
              </ListItemIcon>
              <ListItemText
                primary={model.name}
                secondary={
                  <Box>
                    <Typography variant="caption" display="block">
                      {model.getFormattedSize()} • {model.getFamily()}
                    </Typography>
                    {model.name === localConfig.selectedModel && (
                      <Chip size="small" label="Selecionado" color="primary" sx={{ mt: 0.5 }} />
                    )}
                  </Box>
                }
              />
              {model.name === localConfig.selectedModel && (
                <CheckIcon color="primary" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon />
            <Typography variant="h6">
              Configurações do OLLAMA
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Status da Conexão */}
        {renderConnectionStatus()}

        {/* Configurações Básicas */}
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Configuração da Conexão
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={localConfig.enabled}
                  onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                />
              }
              label="Habilitar integração OLLAMA"
            />
          </Box>

          <TextField
            fullWidth
            label="URL do OLLAMA"
            value={localConfig.baseUrl}
            onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
            placeholder="http://localhost:11434"
            margin="normal"
            helperText="URL onde o serviço OLLAMA está rodando"
          />

          <TextField
            fullWidth
            label="Timeout (ms)"
            type="number"
            value={localConfig.timeout}
            onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
            margin="normal"
            helperText="Tempo limite para requisições em milissegundos"
            inputProps={{ min: 1000, max: 120000 }}
          />

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={handleTestConnection}
              disabled={isTesting || !localConfig.baseUrl}
              startIcon={isTesting ? <CircularProgress size={16} /> : <SpeedIcon />}
            >
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Button>

            {hasUnsavedChanges && (
              <Button
                variant="contained"
                onClick={handleSaveConfig}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={16} /> : <CheckIcon />}
              >
                Salvar Configurações
              </Button>
            )}
          </Box>

          {renderTestResult()}
        </Paper>

        {/* Lista de Modelos */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              Modelos Disponíveis
            </Typography>
            <Tooltip title="Atualizar lista de modelos">
              <IconButton
                onClick={handleRefreshModels}
                disabled={isLoading || !serviceStatus?.isConnected}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            renderModelsList()
          )}
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
