/**
 * Entidade de configuração do Stable Diffusion
 * @class StableDiffusionConfig
 */
export class StableDiffusionConfig {
  /**
   * @param {string} baseUrl - URL base do Stable Diffusion API
   * @param {string} model - Modelo a ser usado
   * @param {number} steps - Número de steps para geração
   * @param {number} width - Largura da imagem
   * @param {number} height - Altura da imagem
   * @param {number} cfgScale - CFG Scale
   * @param {string} sampler - Sampler method
   * @param {boolean} enabled - Se a integração está habilitada
   * @param {string} token - Token de autenticação para a API SD (opcional)
   */
  constructor(
    baseUrl = 'http://192.168.3.70:7861', 
    model = 'v1-5-pruned-emaonly.safetensors', 
    steps = 20,
    width = 512,
    height = 512,
    cfgScale = 7,
    sampler = 'Euler a',
    enabled = false,
    token = ''
  ) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.steps = steps;
    this.width = width;
    this.height = height;
    this.cfgScale = cfgScale;
    this.sampler = sampler;
    this.enabled = enabled;
    this.token = token;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Cria uma configuração padrão do Stable Diffusion
   * @returns {StableDiffusionConfig}
   */
  static createDefault() {
    return new StableDiffusionConfig();
  }

  /**
   * Valida a configuração
   * @returns {boolean}
   */
  isValid() {
    return (
      this.baseUrl &&
      this.model &&
      this.steps > 0 &&
      this.width > 0 &&
      this.height > 0 &&
      this.cfgScale > 0
    );
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toObject() {
    return {
      baseUrl: this.baseUrl,
      model: this.model,
      steps: this.steps,
      width: this.width,
      height: this.height,
      cfgScale: this.cfgScale,
      sampler: this.sampler,
      enabled: this.enabled,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Cria instância a partir de objeto
   * @param {Object} obj - Objeto com dados da configuração
   * @returns {StableDiffusionConfig}
   */
  static fromObject(obj) {
    const config = new StableDiffusionConfig(
      obj.baseUrl,
      obj.model,
      obj.steps,
      obj.width,
      obj.height,
      obj.cfgScale,
      obj.sampler,
      obj.enabled,
      obj.token
    );
    
    if (obj.createdAt) config.createdAt = new Date(obj.createdAt);
    if (obj.updatedAt) config.updatedAt = new Date(obj.updatedAt);
    
    return config;
  }

  /**
   * Atualiza a configuração
   * @param {Object} updates - Atualizações
   */
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date();
  }

  /**
   * Lista de samplers disponíveis
   * @returns {Array<string>}
   */
  static getAvailableSamplers() {
    return [
      'Euler a',
      'Euler',
      'LMS',
      'Heun',
      'DPM2',
      'DPM2 a',
      'DPM++ 2S a',
      'DPM++ 2M',
      'DPM++ SDE',
      'DPM fast',
      'DPM adaptive',
      'LMS Karras',
      'DPM2 Karras',
      'DPM2 a Karras',
      'DPM++ 2S a Karras',
      'DPM++ 2M Karras',
      'DPM++ SDE Karras',
      'DDIM',
      'PLMS'
    ];
  }

  /**
   * Lista de resoluções comuns
   * @returns {Array<Object>}
   */
  static getCommonResolutions() {
    return [
      { label: '512x512 (Square)', width: 512, height: 512 },
      { label: '768x768 (Square HD)', width: 768, height: 768 },
      { label: '512x768 (Portrait)', width: 512, height: 768 },
      { label: '768x512 (Landscape)', width: 768, height: 512 },
      { label: '1024x1024 (Large Square)', width: 1024, height: 1024 },
      { label: '1024x768 (Large Landscape)', width: 1024, height: 768 },
      { label: '768x1024 (Large Portrait)', width: 768, height: 1024 }
    ];
  }
}
