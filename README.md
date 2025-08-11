# XandAI - Assistente Virtual Inteligente

## 🤖 Visão Geral

XandAI é um assistente virtual moderno e inteligente construído com React e Material-UI, featuring uma integração completa com OLLAMA para modelos de IA locais. A aplicação oferece uma interface de chat elegante com tema escuro e funcionalidades avançadas de gerenciamento de modelos.

## ✨ Principais Funcionalidades

### 🎨 Interface Moderna
- **Tema Escuro**: Design elegante e moderno otimizado para reduzir fadiga visual
- **Responsivo**: Interface adaptável para desktop e mobile
- **Material-UI**: Componentes consistentes e acessíveis
- **Animações Suaves**: Transições e feedback visual aprimorados

### 🧠 Integração de IA
- **OLLAMA Integration**: Conecte-se com modelos de IA locais
- **Fallback Automático**: Sistema inteligente que alterna entre OLLAMA e respostas mock
- **Seleção de Modelos**: Interface para escolher e gerenciar modelos disponíveis
- **Status em Tempo Real**: Indicadores visuais do status da conexão e modelo

### 💬 Chat Avançado
- **Mensagens em Tempo Real**: Interface de chat fluida e responsiva
- **Histórico Persistente**: Manutenção do histórico de conversas
- **Indicadores de Digitação**: Feedback visual durante o processamento
- **Gestão de Sessões**: Controle completo sobre sessões de chat

### ⚙️ Configuração Flexível
- **Painel de Configurações**: Interface intuitiva para configurar OLLAMA
- **Teste de Conectividade**: Verificação automática da disponibilidade do serviço
- **Gerenciamento de Modelos**: Download, seleção e remoção de modelos
- **Configuração Persistente**: Configurações salvas localmente

## 🏗️ Arquitetura

O projeto segue os princípios de Clean Architecture com separação clara de responsabilidades:

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── chat/            # Componentes específicos do chat
│   ├── settings/        # Configurações e painéis
│   └── common/          # Componentes compartilhados
├── application/         # Camada de aplicação
│   ├── hooks/           # Custom hooks React
│   └── services/        # Serviços de negócio
├── domain/              # Entidades e regras de negócio
│   ├── entities/        # Modelos de dados
│   └── repositories/    # Interfaces de repositório
├── infrastructure/      # Implementações de infraestrutura
│   ├── api/             # Integrações com APIs externas
│   └── mock-api/        # Implementações mock
└── styles/              # Temas e estilos globais
```

## 🚀 Começando

### Pré-requisitos

- Node.js 16+ e npm/yarn
- OLLAMA instalado (opcional, para IA local)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/xandai.git
   cd xandai
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie a aplicação**
   ```bash
   npm start
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

### Configuração do OLLAMA (Opcional)

Para usar modelos de IA locais, configure o OLLAMA:

1. **Instale o OLLAMA**
   ```bash
   # Linux/macOS
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows: Download do site oficial
   ```

2. **Inicie o serviço**
   ```bash
   ollama serve
   ```

3. **Baixe modelos**
   ```bash
   ollama pull llama2:latest
   ollama pull mistral:latest
   ```

4. **Configure no XandAI**
   - Clique no botão de configurações no cabeçalho
   - Habilite a integração OLLAMA
   - Teste a conexão
   - Selecione um modelo

## 🎯 Como Usar

### Interface Principal

1. **Seletor de Modelo**: No cabeçalho, escolha entre Mock AI ou modelos OLLAMA
2. **Chat**: Digite mensagens na área de input
3. **Configurações**: Acesse via botão de configurações para gerenciar OLLAMA
4. **Histórico**: Use o botão "Limpar" para resetar a conversa

### Configurações OLLAMA

1. **Conexão**: Configure a URL do OLLAMA (padrão: http://localhost:11434)
2. **Modelos**: Visualize, selecione e gerencie modelos disponíveis
3. **Status**: Monitore a conectividade e status dos modelos
4. **Timeout**: Ajuste o tempo limite para requisições

### Funcionalidades do Chat

- **Envio de Mensagens**: Digite e pressione Enter ou clique em "Enviar"
- **Fallback Automático**: Se OLLAMA falhar, o sistema usa respostas mock automaticamente
- **Histórico**: Conversas são mantidas durante a sessão
- **Indicadores**: Veja quando o assistente está "digitando"

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL padrão do OLLAMA
REACT_APP_OLLAMA_DEFAULT_URL=http://localhost:11434

# Timeout padrão (ms)
REACT_APP_OLLAMA_DEFAULT_TIMEOUT=30000

# Habilitar debug
REACT_APP_DEBUG=true
```

### Customização de Temas

Edite `src/styles/theme/theme.js` para personalizar cores e estilos:

```javascript
export const customTheme = createTheme({
  palette: {
    primary: {
      main: '#sua-cor-primaria',
    },
    // ... outras configurações
  }
});
```

## 📚 Documentação

### Documentação Completa
- [Integração OLLAMA](docs/OLLAMA_INTEGRATION.md) - Guia completo da integração OLLAMA
- [Arquitetura](docs/README.md) - Detalhes da arquitetura do sistema

### APIs e Schemas

#### Entidades Principais

**OllamaConfig**
```javascript
{
  baseUrl: string,     // URL do OLLAMA
  timeout: number,     // Timeout em ms
  selectedModel: string, // Modelo selecionado
  enabled: boolean     // Se está habilitado
}
```

**OllamaModel**
```javascript
{
  name: string,        // Nome do modelo
  size: number,        // Tamanho em bytes  
  family: string,      // Família (llama, mistral, etc.)
  tag: string,         // Versão/tag
  isAvailable: boolean // Disponibilidade
}
```

**Message**
```javascript
{
  id: string,          // ID único
  content: string,     // Conteúdo da mensagem
  sender: 'user'|'assistant', // Remetente
  timestamp: Date,     // Timestamp
  isTyping: boolean    // Se é mensagem de digitação
}
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm start          # Inicia servidor de desenvolvimento
npm test           # Executa testes
npm run build      # Build para produção
npm run eject      # Ejeta configuração (irreversível)
```

### Linting e Formatação
```bash
npm run lint       # Verifica problemas de código
npm run format     # Formata código automaticamente
```

## 🧪 Testes

Execute os testes automatizados:

```bash
# Testes unitários
npm test

# Testes com coverage
npm test -- --coverage

# Testes em modo watch
npm test -- --watch
```

## 📦 Build e Deploy

### Build de Produção
```bash
npm run build
```

### Deploy
O build gera arquivos estáticos na pasta `build/` que podem ser servidos por qualquer servidor web:

```bash
# Servir localmente para teste
npx serve -s build

# Deploy para Netlify, Vercel, etc.
# Faça upload da pasta build/
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código estabelecidos
- Escreva testes para novas funcionalidades
- Documente mudanças importantes
- Use commits semânticos

## 📋 Roadmap

### Próximas Funcionalidades
- [ ] **Autenticação de Usuário**: Sistema de login e perfis
- [ ] **Múltiplas Sessões**: Gerenciamento de várias conversas
- [ ] **Exportação de Conversas**: PDF, texto, etc.
- [ ] **Plugins Personalizados**: Sistema de extensões
- [ ] **API REST**: Backend para persistência
- [ ] **Sincronização em Nuvem**: Backup automático
- [ ] **Comandos de Voz**: Integração com speech-to-text
- [ ] **Modo Colaborativo**: Chat em grupo

### Melhorias Técnicas
- [ ] **PWA**: Progressive Web App
- [ ] **Offline Mode**: Funcionalidade offline
- [ ] **Performance**: Otimizações de carregamento
- [ ] **Acessibilidade**: Melhorias de a11y
- [ ] **Internacionalização**: Suporte a múltiplos idiomas

## 🐛 Problemas Conhecidos

### OLLAMA
- Primeira execução pode ser lenta (carregamento do modelo)
- Requer recursos significativos (CPU/GPU/RAM)
- Compatibilidade limitada a modelos suportados

### Interface
- Mobile precisa de otimizações adicionais
- Alguns componentes podem não funcionar em browsers antigos

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **OLLAMA Team** - Pela excelente ferramenta de IA local
- **Material-UI** - Pelo sistema de componentes
- **React Team** - Pelo framework incrível
- **Comunidade Open Source** - Por inspirações e contribuições

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/xandai/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/xandai/discussions)
- **Email**: seu-email@exemplo.com

---

**XandAI** - Construindo o futuro das interfaces de IA, uma conversa por vez. 🚀