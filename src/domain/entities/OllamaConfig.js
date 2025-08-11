/**
 * Entidade de configuração do OLLAMA
 * @class OllamaConfig
 */
export class OllamaConfig {
  /**
   * @param {string} baseUrl - URL base do OLLAMA
   * @param {number} timeout - Timeout das requisições em ms
   * @param {string} selectedModel - Modelo selecionado
   * @param {boolean} enabled - Se a integração está habilitada
   */
  constructor(baseUrl = 'http://localhost:11434', timeout = 30000, selectedModel = '', enabled = false) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.selectedModel = selectedModel;
    this.enabled = enabled;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Cria uma configuração padrão do OLLAMA
   * @returns {OllamaConfig}
   */
  static createDefault() {
    return new OllamaConfig();
  }

  /**
   * Cria uma configuração do OLLAMA a partir de um objeto
   * @param {Object} data - Dados da configuração
   * @returns {OllamaConfig}
   */
  static fromObject(data) {
    const config = new OllamaConfig(
      data.baseUrl,
      data.timeout,
      data.selectedModel,
      data.enabled
    );
    
    if (data.createdAt) {
      config.createdAt = new Date(data.createdAt);
    }
    
    if (data.updatedAt) {
      config.updatedAt = new Date(data.updatedAt);
    }

    return config;
  }

  /**
   * Valida a configuração
   * @returns {Object} - Resultado da validação
   */
  validate() {
    const errors = [];

    if (!this.baseUrl || typeof this.baseUrl !== 'string') {
      errors.push('URL base é obrigatória');
    }

    if (this.baseUrl && !this.isValidUrl(this.baseUrl)) {
      errors.push('URL base deve ser uma URL válida');
    }

    if (this.timeout && (typeof this.timeout !== 'number' || this.timeout < 1000)) {
      errors.push('Timeout deve ser um número maior que 1000ms');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Verifica se uma URL é válida
   * @param {string} url - URL para validar
   * @returns {boolean}
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Atualiza a configuração
   * @param {Object} updates - Atualizações a serem aplicadas
   */
  update(updates) {
    if (updates.baseUrl !== undefined) {
      this.baseUrl = updates.baseUrl;
    }
    
    if (updates.timeout !== undefined) {
      this.timeout = updates.timeout;
    }
    
    if (updates.selectedModel !== undefined) {
      this.selectedModel = updates.selectedModel;
    }
    
    if (updates.enabled !== undefined) {
      this.enabled = updates.enabled;
    }

    this.updatedAt = new Date();
  }

  /**
   * Converte a configuração para objeto
   * @returns {Object}
   */
  toObject() {
    return {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
      selectedModel: this.selectedModel,
      enabled: this.enabled,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Verifica se a configuração está completa para uso
   * @returns {boolean}
   */
  isComplete() {
    return this.enabled && 
           this.baseUrl && 
           this.selectedModel && 
           this.validate().isValid;
  }
}
