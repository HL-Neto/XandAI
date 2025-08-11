import { ChatRepository } from '../../domain/repositories/ChatRepository.js';
import { Message } from '../../domain/entities/Message.js';

/**
 * Implementação mock do ChatRepository
 * @class MockChatRepository
 * @extends {ChatRepository}
 */
export class MockChatRepository extends ChatRepository {
  constructor() {
    super();
    this.messages = [];
    this.mockResponses = [
      "Olá! Eu sou o XandAI, seu assistente virtual. Como posso te ajudar hoje?",
      "Essa é uma excelente pergunta! Vou fazer o meu melhor para te ajudar.",
      "Entendi seu ponto. Deixe-me pensar em uma solução para isso.",
      "Ótima questão! Aqui está o que eu penso sobre isso...",
      "Interessante! Essa é uma área que eu conheço bem. Vou te explicar.",
      "Claro! Posso te ajudar com isso. Vamos começar pelo básico.",
      "Perfeito! Essa é uma das minhas especialidades.",
      "Boa pergunta! Vou te dar uma resposta detalhada sobre isso.",
      "Entendi completamente. Aqui está uma explicação passo a passo.",
      "Excelente! Vou te mostrar diferentes formas de abordar isso."
    ];
  }

  /**
   * Simula o envio de uma mensagem e retorna uma resposta mock
   * @param {string} message - Mensagem do usuário
   * @returns {Promise<string>} - Resposta simulada do XandAI
   */
  async sendMessage(message) {
    // Simula delay de rede
    await this.simulateNetworkDelay();

    // Seleciona uma resposta mock aleatória
    const randomIndex = Math.floor(Math.random() * this.mockResponses.length);
    let response = this.mockResponses[randomIndex];

    // Personaliza a resposta baseada na mensagem do usuário
    response = this.personalizeResponse(message, response);

    return response;
  }

  /**
   * Retorna o histórico de mensagens armazenadas
   * @returns {Promise<Message[]>} - Array de mensagens
   */
  async getMessageHistory() {
    await this.simulateNetworkDelay(100); // Delay menor para operação local
    return [...this.messages];
  }

  /**
   * Salva uma mensagem no histórico local
   * @param {Message} message - Mensagem a ser salva
   * @returns {Promise<void>}
   */
  async saveMessage(message) {
    await this.simulateNetworkDelay(50); // Delay muito pequeno para salvar
    this.messages.push(message);
  }

  /**
   * Limpa o histórico de mensagens
   * @returns {Promise<void>}
   */
  async clearHistory() {
    await this.simulateNetworkDelay(100);
    this.messages = [];
  }

  /**
   * Simula delay de rede
   * @param {number} minDelay - Delay mínimo em ms
   * @param {number} maxDelay - Delay máximo em ms
   * @returns {Promise<void>}
   */
  async simulateNetworkDelay(minDelay = 500, maxDelay = 2000) {
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Personaliza a resposta baseada na mensagem do usuário
   * @param {string} userMessage - Mensagem do usuário
   * @param {string} baseResponse - Resposta base
   * @returns {string} - Resposta personalizada
   */
  personalizeResponse(userMessage, baseResponse) {
    const lowerMessage = userMessage.toLowerCase();

    // Respostas específicas para certas palavras-chave
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
      return "Olá! Muito prazer, eu sou o XandAI! 👋 Como posso te ajudar hoje?";
    }

    if (lowerMessage.includes('nome') || lowerMessage.includes('quem é você')) {
      return "Eu sou o XandAI, seu assistente virtual inteligente! Fui criado para te ajudar com suas dúvidas e conversas. Em que posso te ajudar?";
    }

    if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
      return "De nada! Fico feliz em poder ajudar! 😊 Há mais alguma coisa que você gostaria de saber?";
    }

    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return "Claro! Estou aqui para te ajudar. Pode me fazer qualquer pergunta ou conversar sobre qualquer assunto que te interesse!";
    }

    if (lowerMessage.includes('programação') || lowerMessage.includes('código')) {
      return "Programação é uma das minhas paixões! Posso te ajudar com dúvidas sobre desenvolvimento, explicar conceitos ou discutir melhores práticas. O que você gostaria de saber?";
    }

    if (lowerMessage.includes('tchau') || lowerMessage.includes('até logo')) {
      return "Até logo! Foi um prazer conversar com você. Sempre que precisar, estarei aqui! 👋";
    }

    // Adiciona um toque pessoal à resposta base
    const personalizedPrefixes = [
      "Que legal que você perguntou sobre isso! ",
      "Adorei sua pergunta! ",
      "É sempre bom discutir sobre isso! ",
      "Que assunto interessante! ",
      ""
    ];

    const randomPrefix = personalizedPrefixes[Math.floor(Math.random() * personalizedPrefixes.length)];
    return randomPrefix + baseResponse;
  }
}
