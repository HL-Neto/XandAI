/**
 * Entidade que representa um modelo do OLLAMA
 * @class OllamaModel
 */
export class OllamaModel {
  /**
   * @param {string} name - Nome do modelo
   * @param {number} size - Tamanho do modelo em bytes
   * @param {string} digest - Hash do modelo
   * @param {Object} details - Detalhes do modelo
   * @param {Date} modifiedAt - Data de modificação
   */
  constructor(name, size = 0, digest = '', details = {}, modifiedAt = new Date()) {
    this.name = name;
    this.size = size;
    this.digest = digest;
    this.details = details;
    this.modifiedAt = modifiedAt;
  }

  /**
   * Cria um modelo a partir dos dados da API do OLLAMA
   * @param {Object} apiData - Dados da API
   * @returns {OllamaModel}
   */
  static fromApiData(apiData) {
    return new OllamaModel(
      apiData.name,
      apiData.size || 0,
      apiData.digest || '',
      apiData.details || {},
      apiData.modified_at ? new Date(apiData.modified_at) : new Date()
    );
  }

  /**
   * Obtém o tamanho formatado do modelo
   * @returns {string}
   */
  getFormattedSize() {
    if (this.size === 0) return 'Desconhecido';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  /**
   * Obtém a família do modelo (ex: llama, mistral, etc.)
   * @returns {string}
   */
  getFamily() {
    if (this.details && this.details.family) {
      return this.details.family;
    }

    // Tenta extrair a família do nome
    const nameParts = this.name.toLowerCase().split(':')[0];
    return nameParts.split('-')[0] || 'desconhecido';
  }

  /**
   * Obtém a versão/tag do modelo
   * @returns {string}
   */
  getTag() {
    const parts = this.name.split(':');
    return parts.length > 1 ? parts[1] : 'latest';
  }

  /**
   * Obtém o nome base do modelo (sem tag)
   * @returns {string}
   */
  getBaseName() {
    return this.name.split(':')[0];
  }

  /**
   * Obtém o nome real/limpo do modelo (sem prefixos de repositório)
   * @returns {string}
   */
  getDisplayName() {
    let baseName = this.getBaseName();
    
    // Remove prefixos de repositórios (hf.co/, huggingface.co/, etc.)
    if (baseName.includes('/')) {
      const parts = baseName.split('/');
      baseName = parts[parts.length - 1]; // Pega a última parte
    }
    
    // Remove sufixos comuns de formato (GGUF, GGML, etc.)
    baseName = baseName.replace(/-GGUF$|-GGML$|-gguf$|-ggml$/i, '');
    
    // Capitaliza a primeira letra de cada palavra
    return baseName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }

  /**
   * Verifica se o modelo está disponível para uso
   * @returns {boolean}
   */
  isAvailable() {
    return !!(this.name && this.digest);
  }

  /**
   * Obtém informações de contexto do modelo
   * @returns {Object}
   */
  getContextInfo() {
    return {
      contextLength: this.details?.parameter_size || 'Desconhecido',
      quantization: this.details?.quantization_level || 'Desconhecido',
      format: this.details?.format || 'Desconhecido'
    };
  }

  /**
   * Converte o modelo para objeto
   * @returns {Object}
   */
  toObject() {
    return {
      name: this.name,
      size: this.size,
      digest: this.digest,
      details: this.details,
      modifiedAt: this.modifiedAt.toISOString(),
      formattedSize: this.getFormattedSize(),
      family: this.getFamily(),
      tag: this.getTag(),
      baseName: this.getBaseName(),
      isAvailable: this.isAvailable(),
      contextInfo: this.getContextInfo()
    };
  }

  /**
   * Obtém uma descrição amigável do modelo
   * @returns {string}
   */
  getDescription() {
    const family = this.getFamily();
    const size = this.getFormattedSize();
    const tag = this.getTag();
    
    return `${family} (${tag}) - ${size}`;
  }
}
