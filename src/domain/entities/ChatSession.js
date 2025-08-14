/**
 * Entidade ChatSession - Representa uma sessão de chat
 * @class ChatSession
 */
export class ChatSession {
  /**
   * @param {string} id - ID único da sessão
   * @param {Message[]} messages - Array de mensagens
   * @param {Date} createdAt - Data de criação da sessão
   * @param {Date} updatedAt - Data da última atualização
   */
  constructor(id, messages = [], createdAt = new Date(), updatedAt = new Date()) {
    this.id = id;
    this.messages = messages;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Adiciona uma nova mensagem à sessão
   * @param {Message} message - Mensagem a ser adicionada
   */
  addMessage(message) {
    this.messages.push(message);
    this.updatedAt = new Date();
  }

  /**
   * Remove uma mensagem da sessão
   * @param {string} messageId - ID da mensagem a ser removida
   */
  removeMessage(messageId) {
    this.messages = this.messages.filter(message => message.id !== messageId);
    this.updatedAt = new Date();
  }

  /**
   * Obtém a última mensagem da sessão
   * @returns {Message|null}
   */
  getLastMessage() {
    return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
  }

  /**
   * Obtém todas as mensagens do usuário
   * @returns {Message[]}
   */
  getUserMessages() {
    return this.messages.filter(message => message.isFromUser());
  }

  /**
   * Obtém todas as mensagens do assistente
   * @returns {Message[]}
   */
  getAssistantMessages() {
    return this.messages.filter(message => message.isFromAssistant());
  }

  /**
   * Verifica se há mensagens na sessão
   * @returns {boolean}
   */
  hasMessages() {
    return this.messages.length > 0;
  }

  /**
   * Limpa todas as mensagens da sessão
   */
  clearMessages() {
    this.messages = [];
    this.updatedAt = new Date();
  }

  /**
   * Cria uma nova sessão de chat
   * @returns {ChatSession}
   */
  static createNew() {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    return new ChatSession(id);
  }
}
