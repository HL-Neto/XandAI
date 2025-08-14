/**
 * Repositório abstrato para integração com OLLAMA
 * @abstract
 * @class OllamaRepository
 */
export class OllamaRepository {
  /**
   * Envia uma mensagem para o OLLAMA e retorna a resposta
   * @param {string} message - Mensagem para enviar
   * @param {string} model - Modelo a ser usado
   * @param {Object} options - Opções adicionais
   * @returns {Promise<string>} - Resposta do modelo
   * @abstract
   */
  async sendMessage(message, model, options = {}) {
    throw new Error('Método sendMessage deve ser implementado');
  }

  /**
   * Lista todos os modelos disponíveis
   * @returns {Promise<OllamaModel[]>} - Lista de modelos
   * @abstract
   */
  async listModels() {
    throw new Error('Método listModels deve ser implementado');
  }

  /**
   * Verifica se o OLLAMA está disponível
   * @returns {Promise<boolean>} - Se o serviço está disponível
   * @abstract
   */
  async checkHealth() {
    throw new Error('Método checkHealth deve ser implementado');
  }

  /**
   * Obtém informações de um modelo específico
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<Object>} - Informações do modelo
   * @abstract
   */
  async getModelInfo(modelName) {
    throw new Error('Método getModelInfo deve ser implementado');
  }

  /**
   * Puxa um modelo do repositório remoto
   * @param {string} modelName - Nome do modelo
   * @param {Function} onProgress - Callback de progresso
   * @returns {Promise<void>}
   * @abstract
   */
  async pullModel(modelName, onProgress = null) {
    throw new Error('Método pullModel deve ser implementado');
  }

  /**
   * Remove um modelo local
   * @param {string} modelName - Nome do modelo
   * @returns {Promise<void>}
   * @abstract
   */
  async deleteModel(modelName) {
    throw new Error('Método deleteModel deve ser implementado');
  }

  /**
   * Gera embeddings para um texto
   * @param {string} text - Texto para gerar embeddings
   * @param {string} model - Modelo a ser usado
   * @returns {Promise<number[]>} - Array de embeddings
   * @abstract
   */
  async generateEmbeddings(text, model) {
    throw new Error('Método generateEmbeddings deve ser implementado');
  }

  /**
   * Obtém a configuração atual do OLLAMA
   * @returns {Promise<OllamaConfig>} - Configuração atual
   * @abstract
   */
  async getConfig() {
    throw new Error('Método getConfig deve ser implementado');
  }

  /**
   * Salva a configuração do OLLAMA
   * @param {OllamaConfig} config - Nova configuração
   * @returns {Promise<void>}
   * @abstract
   */
  async saveConfig(config) {
    throw new Error('Método saveConfig deve ser implementado');
  }
}
