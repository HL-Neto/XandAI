/**
 * Interface ChatRepository - Define o contrato para operações de chat
 * @interface ChatRepository
 */
export class ChatRepository {
  /**
   * Envia uma mensagem e recebe a resposta
   * @param {string} message - Mensagem do usuário
   * @returns {Promise<string>} - Resposta do assistente
   * @abstract
   */
  async sendMessage(message) {
    throw new Error('Método sendMessage deve ser implementado');
  }

  /**
   * Obtém o histórico de mensagens
   * @returns {Promise<Message[]>} - Array de mensagens
   * @abstract
   */
  async getMessageHistory() {
    throw new Error('Método getMessageHistory deve ser implementado');
  }

  /**
   * Salva uma mensagem no histórico
   * @param {Message} message - Mensagem a ser salva
   * @returns {Promise<void>}
   * @abstract
   */
  async saveMessage(message) {
    throw new Error('Método saveMessage deve ser implementado');
  }

  /**
   * Limpa o histórico de mensagens
   * @returns {Promise<void>}
   * @abstract
   */
  async clearHistory() {
    throw new Error('Método clearHistory deve ser implementado');
  }
}
