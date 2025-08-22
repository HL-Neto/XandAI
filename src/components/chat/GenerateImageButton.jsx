import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Card,
  CardMedia,
  CircularProgress
} from '@mui/material';
import {
  Image as ImageIcon
} from '@mui/icons-material';
import { useStableDiffusion } from '../../application/hooks/useStableDiffusion';

/**
 * Botão para gerar imagem baseada na resposta do chat
 */
const GenerateImageButton = ({ chatResponse, messageId, compact = false, onImageGenerated }) => {
  const { config } = useStableDiffusion();
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extrai prompt da resposta do chat
  const extractPromptFromResponse = (response) => {
    return response
      .replace(/```[\s\S]*?```/g, '') // Remove código
      .replace(/[#*`]/g, '') // Remove markdown
      .replace(/\n+/g, ' ') // Une linhas
      .replace(/\s+/g, ' ') // Remove espaços extras
      .trim()
      .substring(0, 150) || 'a beautiful, detailed illustration';
  };

  const saveImageToHistory = async (messageId, imageUrl, filename, originalPrompt) => {
    const response = await fetch(`http://localhost:3001/api/v1/chat/messages/${messageId}/attachments/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: imageUrl,
        filename: filename,
        originalPrompt: originalPrompt,
        metadata: {
          generatedAt: new Date().toISOString(),
          stableDiffusionConfig: {
            model: config.model,
            steps: config.steps,
            width: config.width,
            height: config.height,
            cfgScale: config.cfgScale,
            sampler: config.sampler
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar imagem no histórico: ${response.status}`);
    }

    return await response.json();
  };

  const handleGenerateImage = async () => {
    if (!config?.enabled) {
      setError('Stable Diffusion não está habilitado. Configure nas configurações.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const prompt = extractPromptFromResponse(chatResponse);
      
      const response = await fetch('http://localhost:3001/api/v1/stable-diffusion/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          negativePrompt: 'low quality, blurry, distorted',
          baseUrl: config.baseUrl,
          model: config.model,
          steps: config.steps,
          width: config.width,
          height: config.height,
          cfgScale: config.cfgScale,
          sampler: config.sampler,
          sdToken: config.token
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const imageUrl = `http://localhost:3001${result.imageUrl}`;
        setGeneratedImage(imageUrl);
        
        // Salva a imagem no histórico se temos messageId
        if (messageId) {
          try {
            const savedMessage = await saveImageToHistory(messageId, result.imageUrl, result.filename, prompt);
            
            // Notifica o componente pai sobre a imagem gerada
            if (onImageGenerated) {
              onImageGenerated(messageId, {
                type: 'image',
                url: result.imageUrl,
                filename: result.filename,
                originalPrompt: prompt,
                metadata: {
                  generatedAt: new Date().toISOString(),
                  stableDiffusionConfig: {
                    model: config.model,
                    steps: config.steps,
                    width: config.width,
                    height: config.height,
                    cfgScale: config.cfgScale,
                    sampler: config.sampler
                  }
                }
              });
            }
          } catch (historyError) {
            console.warn('Erro ao salvar imagem no histórico:', historyError);
            // Não falha se não conseguir salvar no histórico
          }
        }
      } else {
        setError(result.error || 'Erro desconhecido ao gerar imagem');
      }
    } catch (err) {
      setError(`Erro na geração: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Se não tem config ou não está habilitado, não mostra o botão
  if (!config?.enabled) {
    return null;
  }

  // Modo compacto - apenas ícone na linha de informações
  if (compact) {
    return (
      <>
        <Button
          variant="text"
          size="small"
          onClick={handleGenerateImage}
          disabled={isLoading}
          sx={{ 
            minWidth: 'auto',
            width: 24,
            height: 20,
            p: 0,
            borderRadius: 1,
            color: isLoading ? 'primary.main' : 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
            '&:disabled': {
              color: 'primary.main',
              animation: isLoading ? 'pulse 2s infinite' : 'none',
            },
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
              '100%': {
                opacity: 1,
              },
            }
          }}
        >
          {isLoading ? (
            <CircularProgress 
              size={14} 
              sx={{ 
                color: 'primary.main',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          ) : (
            <ImageIcon sx={{ fontSize: 16 }} />
          )}
        </Button>

        {/* Não mostra imagem no modo compacto - ela aparecerá via histórico */}

        {/* Progress e error aparecem como toast sutil */}
        {error && (
          <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            zIndex: 1000,
            maxWidth: 300 
          }}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ 
                fontSize: '0.75rem',
                '& .MuiAlert-message': {
                  py: 0.5
                }
              }}
            >
              {error}
            </Alert>
          </Box>
        )}
      </>
    );
  }

  // Modo normal - layout completo
  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      {/* Imagem gerada - centralizada */}
      {generatedImage && (
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Card 
            sx={{ 
              maxWidth: 400, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              image={generatedImage}
              alt="Imagem gerada pelo Stable Diffusion"
              sx={{ 
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Card>
        </Box>
      )}

      {/* Botão de gerar imagem - centralizado */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ImageIcon />}
          onClick={handleGenerateImage}
          disabled={isLoading}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 2,
            py: 0.75,
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
            }
          }}
        >
          {isLoading ? 'Gerando...' : 'Gerar Imagem'}
        </Button>
      </Box>

      {/* Progress bar - centralizada */}
      {isLoading && (
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LinearProgress 
            sx={{ 
              borderRadius: 1, 
              height: 6,
              width: '100%',
              maxWidth: 300,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
              }
            }} 
          />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            Gerando imagem com Stable Diffusion...
          </Typography>
        </Box>
      )}

      {/* Erro - centralizado */}
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: 400,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default GenerateImageButton;