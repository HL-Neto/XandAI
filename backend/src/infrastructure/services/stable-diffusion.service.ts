import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface StableDiffusionConfig {
  baseUrl: string;
  model?: string;
  steps?: number;
  width?: number;
  height?: number;
  cfgScale?: number;
  sampler?: string;
  enabled?: boolean;
  token?: string;
}

export interface GenerateImageDto {
  prompt: string;
  negativePrompt?: string;
  config?: StableDiffusionConfig;
}

export interface GeneratedImageResult {
  success: boolean;
  imagePath?: string;
  imageUrl?: string;
  filename?: string;
  error?: string;
  metadata?: any;
}

/**
 * Serviço para integração com Stable Diffusion API
 */
@Injectable()
export class StableDiffusionService {
  private readonly logger = new Logger(StableDiffusionService.name);
  private readonly defaultBaseUrl: string;
  private readonly imagesDir: string;

  constructor(private readonly configService: ConfigService) {
    this.defaultBaseUrl = this.configService.get<string>('SD_BASE_URL', 'http://192.168.3.70:7861');
    
    // Configurar diretório de imagens
    this.imagesDir = path.join(process.cwd(), 'public', 'images');
    this.ensureImagesDirExists();
  }

  /**
   * Garante que o diretório de imagens existe
   */
  private ensureImagesDirExists(): void {
    try {
      if (!fs.existsSync(this.imagesDir)) {
        fs.mkdirSync(this.imagesDir, { recursive: true });
        this.logger.log(`Diretório de imagens criado: ${this.imagesDir}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao criar diretório de imagens: ${error.message}`);
    }
  }

  /**
   * Testa a conexão com o Stable Diffusion
   */
  async testConnection(baseUrl?: string, sdToken?: string): Promise<{ success: boolean; message: string; version?: string }> {
    const url = baseUrl || this.defaultBaseUrl;
    
    try {
      this.logger.log(`Testando conexão com SD: ${url}`);

      const headers: Record<string, string> = {};
      if (sdToken) {
        headers['Authorization'] = `Bearer ${sdToken}`;
      }

      const response = await fetch(`${url}/docs`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000) // 10 segundos
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Conexão estabelecida com sucesso',
        version: 'API disponível'
      };
    } catch (error) {
      this.logger.error(`Erro ao testar conexão SD: ${error.message}`);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Obtém modelos disponíveis
   */
  async getAvailableModels(baseUrl?: string, sdToken?: string): Promise<any[]> {
    const url = baseUrl || this.defaultBaseUrl;
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (sdToken) {
        headers['Authorization'] = `Bearer ${sdToken}`;
      }

      const response = await fetch(`${url}/sdapi/v1/sd-models`, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar modelos: ${response.status}`);
      }

      const models = await response.json();
      this.logger.log(`Encontrados ${models.length} modelos SD`);
      
      return models.map(model => ({
        title: model.title,
        model_name: model.model_name,
        filename: model.filename
      }));
    } catch (error) {
      this.logger.error(`Erro ao buscar modelos SD: ${error.message}`);
      return [];
    }
  }

  /**
   * Gera uma imagem usando Stable Diffusion
   */
  async generateImage(generateDto: GenerateImageDto): Promise<GeneratedImageResult> {
    const startTime = Date.now();
    
    try {
      const config = generateDto.config || {} as StableDiffusionConfig;
      const baseUrl = config.baseUrl || this.defaultBaseUrl;

      if (config.enabled === false) {
        throw new Error('Stable Diffusion não está habilitado');
      }

      this.logger.log(`Gerando imagem com prompt: "${generateDto.prompt.substring(0, 50)}..."`);
      this.logger.log(`Usando SD URL: ${baseUrl}`);

      const requestBody = {
        prompt: generateDto.prompt,
        negative_prompt: generateDto.negativePrompt || "low quality, blurry, distorted",
        steps: config.steps || 20,
        width: config.width || 512,
        height: config.height || 512,
        cfg_scale: config.cfgScale || 7,
        sampler_name: config.sampler || 'Euler a',
        batch_size: 1,
        n_iter: 1,
        seed: -1,
        ...(config.model && {
          override_settings: {
            sd_model_checkpoint: config.model
          }
        })
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.token) {
        headers['Authorization'] = `Bearer ${config.token}`;
      }

      const response = await fetch(`${baseUrl}/sdapi/v1/txt2img`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(300000) // 5 minutos
      });

      if (!response.ok) {
        throw new Error(`Erro na geração SD: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.images || result.images.length === 0) {
        throw new Error('Nenhuma imagem foi gerada pelo SD');
      }

      // Salvar imagem
      const imageBase64 = result.images[0];
      const filename = `sd_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
      const imagePath = path.join(this.imagesDir, filename);
      const imageUrl = `/images/${filename}`;

      // Converter base64 para buffer e salvar
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      fs.writeFileSync(imagePath, imageBuffer);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Imagem gerada e salva em ${processingTime}ms: ${filename}`);

      return {
        success: true,
        imagePath,
        imageUrl,
        filename,
        metadata: {
          prompt: generateDto.prompt,
          negativePrompt: generateDto.negativePrompt,
          parameters: requestBody,
          processingTime,
          info: result.info ? JSON.parse(result.info) : null
        }
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(`Erro ao gerar imagem: ${error.message} (${processingTime}ms)`);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém informações do sistema SD
   */
  async getSystemInfo(baseUrl?: string): Promise<any> {
    const url = baseUrl || this.defaultBaseUrl;
    
    try {
      const response = await fetch(`${url}/sdapi/v1/memory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter info do sistema: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Erro ao obter info do sistema SD: ${error.message}`);
      return null;
    }
  }

  /**
   * Interrompe geração em andamento
   */
  async interruptGeneration(baseUrl?: string): Promise<boolean> {
    const url = baseUrl || this.defaultBaseUrl;
    
    try {
      const response = await fetch(`${url}/sdapi/v1/interrupt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.ok;
    } catch (error) {
      this.logger.error(`Erro ao interromper geração SD: ${error.message}`);
      return false;
    }
  }

  /**
   * Lista imagens salvas
   */
  async listSavedImages(): Promise<string[]> {
    try {
      const files = fs.readdirSync(this.imagesDir);
      return files
        .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
        .sort((a, b) => {
          const statA = fs.statSync(path.join(this.imagesDir, a));
          const statB = fs.statSync(path.join(this.imagesDir, b));
          return statB.mtime.getTime() - statA.mtime.getTime(); // Mais recente primeiro
        });
    } catch (error) {
      this.logger.error(`Erro ao listar imagens: ${error.message}`);
      return [];
    }
  }

  /**
   * Remove imagens antigas (cleanup)
   */
  async cleanupOldImages(maxAgeHours = 24): Promise<number> {
    try {
      const files = fs.readdirSync(this.imagesDir);
      const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
      let removedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.imagesDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          removedCount++;
        }
      }

      if (removedCount > 0) {
        this.logger.log(`Removidas ${removedCount} imagens antigas (> ${maxAgeHours}h)`);
      }

      return removedCount;
    } catch (error) {
      this.logger.error(`Erro ao limpar imagens antigas: ${error.message}`);
      return 0;
    }
  }
}
