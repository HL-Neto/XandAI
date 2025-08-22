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
      "Olá! 😊 Eu sou o **XandAI**, seu assistente virtual. Como posso te ajudar hoje?",
      "Essa é uma **excelente pergunta**! Vou fazer o meu melhor para te ajudar.",
      "Entendi seu ponto. Deixe-me pensar em uma solução para isso... 🤔",
      "Ótima questão! Aqui está o que eu penso sobre isso:\n\n* Primeiro, vamos analisar o problema\n* Depois, pensamos nas possíveis soluções\n* E por fim, implementamos a melhor abordagem",
      "Interessante! Essa é uma área que eu conheço bem. Vou te explicar:\n\n> \"A melhor forma de aprender é praticando e experimentando.\"\n\nVamos começar com alguns conceitos básicos.",
      "Claro! Posso te ajudar com isso. Vamos começar pelo **básico**:\n\n1. Identificar o objetivo\n2. Planejar a abordagem\n3. Executar passo a passo\n4. Avaliar os resultados",
      "Perfeito! Essa é uma das minhas **especialidades**. Aqui está um exemplo prático:\n\n```javascript\nfunction exemplo() {\n  console.log('Olá, mundo!');\n}\n```",
      "Boa pergunta! Vou te dar uma resposta **detalhada** sobre isso:\n\n### Pontos importantes:\n- Sempre considere o contexto\n- Pense nas implicações\n- Teste suas hipóteses\n\n*Espero que isso ajude!* ✨",
      "Entendi completamente. Aqui está uma **explicação passo a passo**:\n\n---\n\n**Passo 1:** Análise inicial\n**Passo 2:** Desenvolvimento da solução\n**Passo 3:** Implementação\n**Passo 4:** Validação\n\n---\n\nCada etapa é importante para o sucesso! 🎯",
      "Excelente! Vou te mostrar **diferentes formas** de abordar isso:\n\n| Abordagem | Vantagens | Desvantagens |\n|-----------|-----------|-------------|\n| Método A  | Rápido    | Menos preciso |\n| Método B  | Preciso   | Mais lento |\n| Método C  | Equilibrado | Complexo |\n\nQual você prefere? 🤓"
    ];
  }

  /**
   * Simula o envio de uma mensagem e retorna uma resposta mock
   * @param {string} message - Mensagem do usuário
   * @param {Function} onToken - Callback para streaming (opcional)
   * @returns {Promise<string>} - Resposta simulada do XandAI
   */
  async sendMessage(message, onToken = null) {
    // Seleciona uma resposta mock aleatória
    const randomIndex = Math.floor(Math.random() * this.mockResponses.length);
    let response = this.mockResponses[randomIndex];

    // Personaliza a resposta baseada na mensagem do usuário
    response = this.personalizeResponse(message, response);

    // Se tem callback de streaming, simula token por token
    if (onToken) {
      await this.simulateStreaming(response, onToken);
    } else {
      // Simula delay de rede normal
      await this.simulateNetworkDelay();
    }

    return response;
  }

  /**
   * Simula streaming de resposta token por token
   * @param {string} fullResponse - Resposta completa
   * @param {Function} onToken - Callback para cada token
   */
  async simulateStreaming(fullResponse, onToken) {
    const words = fullResponse.split(' ');
    let currentResponse = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentResponse += (i > 0 ? ' ' : '') + word;
      
      // Simula delay entre tokens
      await this.simulateNetworkDelay(50, 200);
      
      // Chama o callback com o token atual
      const isLast = i === words.length - 1;
      onToken(word + (i < words.length - 1 ? ' ' : ''), currentResponse, isLast);
    }
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
      return "Olá! 👋 Muito prazer, eu sou o **XandAI**!\n\nComo posso te ajudar hoje? Posso:\n\n* Responder perguntas\n* Ajudar com programação\n* Conversar sobre diversos assuntos\n* E muito mais!\n\n*Fique à vontade para perguntar qualquer coisa!* ✨";
    }

    if (lowerMessage.includes('nome') || lowerMessage.includes('quem é você')) {
      return "## Sobre mim 🤖\n\nEu sou o **XandAI**, seu assistente virtual inteligente!\n\n### O que posso fazer:\n- ✅ Responder perguntas\n- ✅ Ajudar com programação\n- ✅ Explicar conceitos\n- ✅ Conversar sobre diversos temas\n- ✅ Dar sugestões e ideias\n\n*Fui criado para te ajudar da melhor forma possível!* 😊";
    }

    if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
      return "De nada! 😊 **Fico muito feliz** em poder ajudar!\n\n*Há mais alguma coisa que você gostaria de saber?*\n\n> \"Ajudar é a minha especialidade!\"";
    }

    if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      return "## Como posso te ajudar? 🚀\n\nEstou aqui para te auxiliar! Aqui estão algumas **opções**:\n\n### 💬 Conversação\n- Tire dúvidas sobre qualquer assunto\n- Converse sobre seus interesses\n- Peça explicações detalhadas\n\n### 💻 Programação\n- Ajuda com código\n- Explicação de conceitos\n- Boas práticas\n- Debug e solução de problemas\n\n### 🎯 Outras áreas\n- Criação de conteúdo\n- Brainstorming\n- Análise de problemas\n- Sugestões e ideias\n\n*Só me falar o que você precisa!* ✨";
    }

    if (lowerMessage.includes('programação') || lowerMessage.includes('código')) {
      return "# Programação é incrível! 💻\n\n**Posso te ajudar com:**\n\n## Linguagens\n- JavaScript, Python, Java, C#\n- HTML, CSS, SQL\n- E muitas outras!\n\n## Conceitos\n- Algoritmos e estruturas de dados\n- Paradigmas de programação\n- Arquitetura de software\n- Boas práticas\n\n## Frameworks & Tools\n- React, Node.js, Spring\n- Git, Docker, APIs\n- Bancos de dados\n\n### Exemplo rápido:\n```javascript\n// Função simples em JavaScript\nfunction saudar(nome) {\n  return `Olá, ${nome}! 👋`;\n}\n\nconsole.log(saudar('Programador'));\n```\n\n*O que você gostaria de saber sobre programação?* 🤓";
    }

    if (lowerMessage.includes('tchau') || lowerMessage.includes('até logo')) {
      return "## Até logo! 👋\n\n**Foi um prazer** conversar com você!\n\n> \"Sempre que precisar, estarei aqui esperando para ajudar.\"\n\n*Tenha um ótimo dia!* ✨😊";
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
