import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Memory as MemoryIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Check as CheckIcon,
  SmartToy as BotIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useOllama } from '../../application/hooks/useOllama';

/**
 * Componente seletor de modelo
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onOpenSettings - Callback para abrir configurações
 * @returns {JSX.Element}
 */
const ModelSelector = ({ onOpenSettings }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const {
    config,
    models,
    serviceStatus,
    isLoading,
    selectModel,
    updateConfig,
    isReady
  } = useOllama();

  /**
   * Abre o menu de modelos
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Fecha o menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Seleciona um modelo
   * @param {string} modelName - Nome do modelo
   */
  const handleSelectModel = async (modelName) => {
    try {
      if (!modelName) {
        // Se não há modelo selecionado, desabilita OLLAMA (usa Mock AI)
        await updateConfig({ enabled: false, selectedModel: '' });
      } else {
        // Seleciona modelo OLLAMA
        await selectModel(modelName);
      }
      handleClose();
    } catch (error) {
      console.error('Erro ao selecionar modelo:', error);
    }
  };

  /**
   * Abre as configurações e fecha o menu
   */
  const handleOpenSettings = () => {
    handleClose();
    onOpenSettings();
  };

  /**
   * Obtém o status do modelo atual
   */
  const getModelStatus = () => {
    if (!config?.enabled) {
      return {
        label: 'Mock AI',
        icon: <BotIcon fontSize="small" />,
        color: 'default',
        description: 'Usando respostas simuladas'
      };
    }

    if (!serviceStatus?.isConnected) {
      return {
        label: 'Mock AI (Fallback)',
        icon: <WarningIcon fontSize="small" />,
        color: 'warning',
        description: 'OLLAMA desconectado - usando fallback'
      };
    }

    if (!config?.selectedModel) {
      return {
        label: 'Nenhum modelo',
        icon: <WarningIcon fontSize="small" />,
        color: 'error',
        description: 'Selecione um modelo OLLAMA'
      };
    }

    const currentModel = models.find(m => m.name === config.selectedModel);
    if (!currentModel) {
      return {
        label: config.selectedModel,
        icon: <WarningIcon fontSize="small" />,
        color: 'error',
        description: 'Modelo não encontrado'
      };
    }

    return {
      label: currentModel.getBaseName(),
      tag: currentModel.getTag(),
      icon: <MemoryIcon fontSize="small" />,
      color: 'success',
      description: `${currentModel.getFamily()} - ${currentModel.getFormattedSize()}`
    };
  };

  const modelStatus = getModelStatus();

  return (
    <>
      <Tooltip title={modelStatus.description}>
        <Button
          variant="outlined"
          onClick={handleClick}
          disabled={isLoading}
          size="small"
          sx={{
            minWidth: 120,
            justifyContent: 'space-between',
            textTransform: 'none',
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(144, 202, 249, 0.08)',
            },
          }}
          endIcon={
            isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <ArrowDownIcon fontSize="small" />
            )
          }
          startIcon={modelStatus.icon}
        >
          <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 80,
              }}
            >
              {modelStatus.label}
            </Typography>
            {modelStatus.tag && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: '0.7rem',
                  lineHeight: 1,
                }}
              >
                {modelStatus.tag}
              </Typography>
            )}
          </Box>
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            maxHeight: 400,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {/* Cabeçalho do menu */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Selecionar Modelo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {serviceStatus?.isConnected 
              ? `${models.length} modelos disponíveis` 
              : 'OLLAMA desconectado'
            }
          </Typography>
        </Box>

        <Divider />

        {/* Mock AI Option */}
        <MenuItem
          onClick={() => handleSelectModel('')}
          selected={!config?.enabled || !config?.selectedModel}
        >
          <ListItemIcon>
            <BotIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Mock AI"
            secondary="Respostas simuladas para desenvolvimento"
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
          {(!config?.enabled || !config?.selectedModel) && (
            <CheckIcon fontSize="small" color="primary" />
          )}
        </MenuItem>

        <Divider />

        {/* OLLAMA Models */}
        {serviceStatus?.isConnected && models.length > 0 ? (
          models.map((model) => (
            <MenuItem
              key={model.name}
              onClick={() => handleSelectModel(model.name)}
              selected={config?.selectedModel === model.name}
              disabled={!model.isAvailable()}
            >
              <ListItemIcon>
                <MemoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {model.getBaseName()}
                    </Typography>
                    <Chip
                      label={model.getTag()}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={`${model.getFamily()} - ${model.getFormattedSize()}`}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
              {config?.selectedModel === model.name && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemIcon>
              <WarningIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Nenhum modelo encontrado"
              secondary={
                serviceStatus?.isConnected 
                  ? "Baixe modelos usando: ollama pull <model>"
                  : "Conecte ao OLLAMA primeiro"
              }
              secondaryTypographyProps={{ fontSize: '0.75rem' }}
            />
          </MenuItem>
        )}

        <Divider />

        {/* Configurações */}
        <MenuItem onClick={handleOpenSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Configurações OLLAMA"
            secondary="Gerenciar conexão e modelos"
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ModelSelector;
