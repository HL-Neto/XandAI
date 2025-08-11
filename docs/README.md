# XandAI - Interface de Chat com React e Material-UI

## 📖 Visão Geral

XandAI é uma interface de chat responsiva e moderna desenvolvida com React e Material-UI, projetada para interações com LLMs (Large Language Models). O projeto segue princípios de Clean Code e Clean Architecture, oferecendo uma experiência de usuário intuitiva e uma base de código mantível.

## ✨ Características Principais

- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Design Moderno**: Interface clean usando Material-UI com tema personalizado
- **Arquitetura Limpa**: Separação clara de responsabilidades e código organizados
- **API Mock**: Simulação de respostas de IA para desenvolvimento e testes
- **Real-time UX**: Indicadores de digitação e animações suaves
- **Tema Personalizado**: Design system consistente com cores e tipografia do XandAI

## 🏗️ Arquitetura

O projeto segue a Clean Architecture, organizando o código em camadas bem definidas:

```
src/
├── domain/                 # Camada de Domínio
│   ├── entities/          # Entidades de negócio
│   └── repositories/      # Interfaces dos repositórios
├── infrastructure/        # Camada de Infraestrutura
│   └── mock-api/         # Implementações mock da API
├── application/           # Camada de Aplicação
│   ├── services/         # Serviços de aplicação
│   └── hooks/            # Hooks personalizados
├── components/           # Camada de Apresentação
│   ├── chat/            # Componentes específicos do chat
│   └── common/          # Componentes reutilizáveis
└── styles/              # Estilos e temas
    └── theme/           # Configuração do tema Material-UI
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd XandAI
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor de desenvolvimento
```bash
npm start
```

4. Acesse a aplicação em `http://localhost:3000`

## 📱 Funcionalidades

### Interface do Chat

- **Mensagens em Tempo Real**: Envio e recebimento de mensagens com feedback visual
- **Indicador de Digitação**: Mostra quando o XandAI está processando uma resposta
- **Histórico de Conversas**: Mantém o histórico das mensagens da sessão
- **Limpeza de Chat**: Opção para limpar todo o histórico
- **Timestamps**: Horário de envio de cada mensagem
- **Avatars**: Identificação visual clara entre usuário e IA

### Responsividade

- **Layout Adaptativo**: Interface otimizada para diferentes tamanhos de tela
- **Touch-Friendly**: Botões e áreas de toque adequados para dispositivos móveis
- **Navegação Intuitiva**: Menu hamburger em dispositivos móveis
- **Typography Escalável**: Tamanhos de fonte que se ajustam ao dispositivo

### Experiência do Usuário

- **Animações Suaves**: Transições e animações que melhoram a percepção de performance
- **Feedback Visual**: Estados de loading, erro e sucesso claramente indicados
- **Tooltips Informativos**: Dicas de uso em botões e funcionalidades
- **Tratamento de Erros**: Mensagens de erro amigáveis e ações de recuperação

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19.1.1**: Biblioteca principal para construção da interface
- **Material-UI 7.3.1**: Sistema de design e componentes UI
- **Emotion**: Biblioteca de CSS-in-JS para estilização

### Desenvolvimento
- **React Scripts**: Configuração e build tools
- **Testing Library**: Ferramentas para testes automatizados
- **Web Vitals**: Métricas de performance da aplicação

## 📊 Estrutura de Componentes

### Componentes Principais

#### `ChatContainer`
Container principal que orquestra toda a interface do chat.

**Responsabilidades:**
- Gerenciamento do estado global do chat
- Coordenação entre header, lista de mensagens e input
- Tratamento de erros e dialogs de confirmação

#### `ChatHeader`
Cabeçalho do chat com informações do XandAI e ações.

**Funcionalidades:**
- Status do bot (online/digitando)
- Contador de mensagens
- Ações de limpar e atualizar chat
- Menu mobile

#### `MessageList`
Lista de mensagens com scroll automático e welcome screen.

**Características:**
- Scroll automático para novas mensagens
- Tela de boas-vindas para novos usuários
- Divisores de data
- Otimização de performance para muitas mensagens

#### `ChatMessage`
Componente individual para cada mensagem.

**Elementos:**
- Balão de mensagem estilizado
- Avatar do remetente
- Timestamp formatado
- Indicador de digitação animado

#### `MessageInput`
Campo de entrada com funcionalidades avançadas.

**Recursos:**
- Input multiline com auto-resize
- Botões de ação (enviar, anexo, emoji, áudio)
- Estados de loading e disabled
- Suporte a atalhos de teclado

## 🎨 Sistema de Design

### Paleta de Cores

```javascript
// Cores Principais
primary: '#1976d2'      // Azul principal do XandAI
secondary: '#9c27b0'    // Roxo secundário
background: '#f5f5f5'   // Fundo padrão
paper: '#ffffff'        // Fundo de cards/papers

// Estados
success: '#4caf50'      // Verde para sucesso
error: '#f44336'        // Vermelho para erros
warning: '#ff9800'      // Laranja para avisos
info: '#2196f3'         // Azul para informações
```

### Tipografia

- **Fonte Principal**: Roboto
- **Hierarquia**: H1-H6 com pesos e tamanhos definidos
- **Responsividade**: Tamanhos adaptativos por breakpoint
- **Legibilidade**: Line-height otimizado para leitura

### Espaçamento

- **Sistema 8px**: Múltiplos de 8 para consistência
- **Breakpoints**: xs, sm, md, lg, xl
- **Grid System**: Layout flexível e responsivo

## 🔧 Configuração e Personalização

### Tema

O tema pode ser customizado em `src/styles/theme/theme.js`:

```javascript
// Personalizar cores
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#sua-cor-aqui',
    },
  },
});
```

### API Mock

As respostas do mock podem ser personalizadas em `src/infrastructure/mock-api/MockChatRepository.js`:

```javascript
// Adicionar novas respostas
this.mockResponses = [
  "Sua resposta personalizada aqui",
  // ... mais respostas
];
```

## 🧪 Testes

### Executar Testes

```bash
npm test
```

### Estrutura de Testes

```
src/
├── __tests__/           # Testes unitários
├── components/
│   └── __tests__/       # Testes de componentes
└── application/
    └── __tests__/       # Testes de lógica de negócio
```

## 📈 Performance

### Otimizações Implementadas

- **Code Splitting**: Carregamento lazy de componentes
- **Memoization**: React.memo em componentes que re-renderizam frequentemente
- **Virtual Scrolling**: Para listas grandes de mensagens
- **Bundle Analysis**: Otimização do tamanho do bundle

### Métricas Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔒 Segurança

### Boas Práticas Implementadas

- **XSS Prevention**: Sanitização de inputs
- **Content Security Policy**: Headers de segurança
- **Dependency Security**: Auditoria regular de dependências
- **Data Validation**: Validação de entrada em todas as camadas

## 🌐 Acessibilidade

### Conformidade WCAG

- **Contraste**: Ratios de contraste adequados
- **Navegação por Teclado**: Suporte completo
- **Screen Readers**: ARIA labels e roles
- **Focus Management**: Ordem lógica de foco

## 📦 Build e Deploy

### Build para Produção

```bash
npm run build
```

### Variáveis de Ambiente

```bash
# .env.production
REACT_APP_API_URL=https://api.xandai.com
REACT_APP_VERSION=1.0.0
```

## 🤝 Contribuição

### Fluxo de Desenvolvimento

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- **ESLint**: Configuração para React
- **Prettier**: Formatação automática
- **Conventional Commits**: Mensagens de commit padronizadas
- **Code Review**: Obrigatório para mudanças

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

### Documentação Adicional

- [Guia de Componentes](./components.md)
- [Arquitetura Detalhada](./architecture.md)
- [API Reference](./api.md)
- [Troubleshooting](./troubleshooting.md)

### Contato

- **Email**: suporte@xandai.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/xandai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/xandai/discussions)

---

Desenvolvido com ❤️ pelo time XandAI
