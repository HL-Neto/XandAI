# Integração OLLAMA - XandAI

## Visão Geral

O XandAI possui integração completa com OLLAMA, permitindo usar modelos de IA locais para conversas. Esta integração oferece fallback automático para respostas mock quando o OLLAMA não está disponível.

## Arquitetura

### Camadas da Integração

```
┌─────────────────────────────────────────┐
│           Interface do Usuário          │
│  ┌─────────────────────────────────────┐│
│  │      SettingsDialog.jsx             ││
│  │   - Configuração de conexão        ││
│  │   - Lista de modelos               ││
│  │   - Seleção de modelo              ││
│  │   - Teste de conectividade         ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Hooks e Serviços              │
│  ┌─────────────────────────────────────┐│
│  │      useOllama.js                   ││
│  │   - Estado da integração           ││
│  │   - Gerenciamento de configuração  ││
│  │   - Operações de modelo            ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │      OllamaService.js               ││
│  │   - Lógica de negócio              ││
│  │   - Validações                     ││
│  │   - Orquestração de operações      ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │      ChatService.js                 ││
│  │   - Integração com chat            ││
│  │   - Fallback automático            ││
│  │   - Gerenciamento de sessões       ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Domínio e Entidades           │
│  ┌─────────────────────────────────────┐│
│  │      OllamaConfig.js                ││
│  │   - Configuração de conexão        ││
│  │   - Validação de dados             ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │      OllamaModel.js                 ││
│  │   - Representação de modelos       ││
│  │   - Metadados e informações        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │      OllamaRepository.js            ││
│  │   - Interface abstrata             ││
│  │   - Contratos de API               ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│           Infraestrutura                │
│  ┌─────────────────────────────────────┐│
│  │      OllamaApiRepository.js         ││
│  │   - Comunicação HTTP               ││
│  │   - Tratamento de erros            ││
│  │   - Persistência de configuração   ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│              OLLAMA API                 │
│           (Servidor Local)              │
└─────────────────────────────────────────┘
```

## Schemas e Estruturas de Dados

### OllamaConfig

```javascript
{
  "baseUrl": "http://localhost:11434",  // URL do servidor OLLAMA
  "timeout": 30000,                     // Timeout em milissegundos
  "selectedModel": "llama2:latest",     // Modelo selecionado
  "enabled": true,                      // Se a integração está ativa
  "createdAt": "2024-01-01T00:00:00Z",  // Data de criação
  "updatedAt": "2024-01-01T00:00:00Z"   // Data de atualização
}
```

**Validações:**
- `baseUrl`: URL válida e obrigatória
- `timeout`: Número entre 1000 e 120000 ms
- `selectedModel`: String não vazia quando enabled=true
- `enabled`: Boolean

### OllamaModel

```javascript
{
  "name": "llama2:latest",              // Nome completo do modelo
  "size": 4109805696,                   // Tamanho em bytes
  "digest": "sha256:abc123...",         // Hash do modelo
  "details": {                          // Detalhes específicos
    "family": "llama",
    "parameter_size": "7B",
    "quantization_level": "Q4_0",
    "format": "gguf"
  },
  "modifiedAt": "2024-01-01T00:00:00Z", // Data de modificação
  
  // Propriedades computadas (getters)
  "formattedSize": "3.8 GB",           // Tamanho formatado
  "family": "llama",                    // Família do modelo
  "tag": "latest",                      // Tag/versão
  "baseName": "llama2",                 // Nome base
  "isAvailable": true,                  // Disponibilidade
  "contextInfo": {                      // Informações de contexto
    "contextLength": "4096",
    "quantization": "Q4_0",
    "format": "gguf"
  }
}
```

### ServiceStatus

```javascript
{
  "isConnected": true,                  // Conexão com OLLAMA
  "isConfigured": true,                 // Configuração válida
  "selectedModel": "llama2:latest",     // Modelo selecionado
  "modelStatus": "available",           // Status do modelo
  "availableModels": 5,                 // Número de modelos
  "baseUrl": "http://localhost:11434",  // URL configurada
  "lastChecked": "2024-01-01T00:00:00Z", // Última verificação
  "error": null                         // Erro, se houver
}
```

**Possíveis valores para `modelStatus`:**
- `"available"`: Modelo disponível e pronto
- `"not_found"`: Modelo selecionado não encontrado
- `"not_selected"`: Nenhum modelo selecionado
- `"unknown"`: Status não pode ser determinado

## API do OLLAMA

### Endpoints Utilizados

#### 1. Verificação de Saúde
```
GET /api/version
```
**Resposta:**
```javascript
{
  "version": "0.1.15"
}
```

#### 2. Listagem de Modelos
```
GET /api/tags
```
**Resposta:**
```javascript
{
  "models": [
    {
      "name": "llama2:latest",
      "modified_at": "2024-01-01T00:00:00Z",
      "size": 4109805696,
      "digest": "sha256:abc123...",
      "details": {
        "family": "llama",
        "parameter_size": "7B"
      }
    }
  ]
}
```

#### 3. Geração de Texto
```
POST /api/generate
```
**Requisição:**
```javascript
{
  "model": "llama2:latest",
  "prompt": "Hello, how are you?",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "top_k": 40
  }
}
```
**Resposta:**
```javascript
{
  "model": "llama2:latest",
  "created_at": "2024-01-01T00:00:00Z",
  "response": "Hello! I'm doing well, thank you for asking...",
  "done": true,
  "context": [128, 256, 512],
  "total_duration": 1234567890,
  "load_duration": 123456789,
  "prompt_eval_count": 5,
  "prompt_eval_duration": 123456789,
  "eval_count": 15,
  "eval_duration": 987654321
}
```

#### 4. Informações do Modelo
```
POST /api/show
```
**Requisição:**
```javascript
{
  "name": "llama2:latest"
}
```
**Resposta:**
```javascript
{
  "modelfile": "FROM /path/to/model...",
  "parameters": "temperature 0.7\ntop_p 0.9...",
  "template": "{{ .System }}\n{{ .Prompt }}",
  "details": {
    "format": "gguf",
    "family": "llama",
    "families": ["llama"],
    "parameter_size": "7B",
    "quantization_level": "Q4_0"
  }
}
```

#### 5. Download de Modelo
```
POST /api/pull
```
**Requisição:**
```javascript
{
  "name": "llama2:latest",
  "stream": true
}
```
**Resposta (Stream):**
```javascript
{"status": "pulling manifest"}
{"status": "downloading", "digest": "sha256:abc123", "total": 1000, "completed": 100}
{"status": "verifying sha256 digest"}
{"status": "writing manifest"}
{"status": "removing any unused layers"}
{"status": "success"}
```

#### 6. Remoção de Modelo
```
DELETE /api/delete
```
**Requisição:**
```javascript
{
  "name": "llama2:latest"
}
```

#### 7. Geração de Embeddings
```
POST /api/embeddings
```
**Requisição:**
```javascript
{
  "model": "llama2:latest",
  "prompt": "Text to embed"
}
```
**Resposta:**
```javascript
{
  "embedding": [0.1, 0.2, -0.3, ...]
}
```

## Tratamento de Erros

### Tipos de Erro

#### 1. Erro de Conexão
```javascript
{
  "type": "CONNECTION_ERROR",
  "message": "Não foi possível conectar ao OLLAMA",
  "code": "ECONNREFUSED",
  "url": "http://localhost:11434"
}
```

#### 2. Erro de Modelo
```javascript
{
  "type": "MODEL_ERROR",
  "message": "Modelo 'llama2:latest' não encontrado",
  "code": "MODEL_NOT_FOUND",
  "model": "llama2:latest"
}
```

#### 3. Erro de Configuração
```javascript
{
  "type": "CONFIG_ERROR",
  "message": "URL base deve ser uma URL válida",
  "code": "INVALID_URL",
  "field": "baseUrl"
}
```

#### 4. Erro de Timeout
```javascript
{
  "type": "TIMEOUT_ERROR",
  "message": "Timeout de 30000ms excedido",
  "code": "REQUEST_TIMEOUT",
  "timeout": 30000
}
```

### Estratégia de Fallback

1. **Tentativa Primary**: Usar OLLAMA se configurado e disponível
2. **Fallback Automático**: Usar MockChatRepository em caso de erro
3. **Notificação**: Avisar o usuário sobre o fallback
4. **Retry**: Tentar reconectar na próxima mensagem

## Configuração e Uso

### 1. Instalação do OLLAMA

```bash
# Linux/macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download do site oficial: https://ollama.ai
```

### 2. Inicialização do Serviço

```bash
# Inicia o OLLAMA na porta padrão 11434
ollama serve
```

### 3. Download de Modelos

```bash
# Baixa um modelo específico
ollama pull llama2:latest
ollama pull mistral:latest
ollama pull codellama:latest
```

### 4. Configuração no XandAI

1. Clique no botão "Configurações" no cabeçalho do chat
2. Habilite a integração OLLAMA
3. Configure a URL (padrão: http://localhost:11434)
4. Teste a conexão
5. Selecione um modelo da lista
6. Salve as configurações

### 5. Verificação de Status

O XandAI automaticamente:
- Verifica a conectividade com OLLAMA
- Lista modelos disponíveis
- Valida o modelo selecionado
- Mostra indicadores de status na interface

## Persistência de Dados

### LocalStorage

As configurações são salvas no `localStorage` do navegador:

```javascript
// Chave: 'ollama-config'
{
  "baseUrl": "http://localhost:11434",
  "timeout": 30000,
  "selectedModel": "llama2:latest",
  "enabled": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Cache de Modelos

A lista de modelos é mantida em memória durante a sessão e atualizada:
- Ao abrir as configurações
- Ao clicar em "Atualizar"
- Após download/remoção de modelos
- A cada teste de conexão

## Monitoramento e Debugging

### Logs do Console

O sistema produz logs detalhados no console do navegador:

```javascript
// Sucesso
console.log('OLLAMA conectado com sucesso:', { 
  models: 5, 
  selectedModel: 'llama2:latest' 
});

// Erro com fallback
console.warn('Erro no OLLAMA, fallback para mock:', error);

// Operações de modelo
console.log('Modelo selecionado:', 'llama2:latest');
```

### Indicadores Visuais

- **Status de Conexão**: Verde (conectado) / Vermelho (desconectado)
- **Modelo Selecionado**: Chip azul na lista de modelos
- **Carregamento**: Spinners durante operações
- **Erros**: Alerts com mensagens específicas

## Exemplos de Uso

### Hook useOllama

```javascript
import { useOllama } from '../hooks/useOllama';

function MyComponent() {
  const {
    config,
    models,
    serviceStatus,
    isLoading,
    error,
    updateConfig,
    selectModel,
    testConnection
  } = useOllama();

  // Habilitar OLLAMA
  const enableOllama = async () => {
    await updateConfig({ enabled: true });
  };

  // Selecionar modelo
  const handleSelectModel = async (modelName) => {
    await selectModel(modelName);
  };

  // Testar conexão
  const handleTestConnection = async () => {
    const result = await testConnection();
    console.log('Teste:', result);
  };

  return (
    // JSX...
  );
}
```

### Serviço OllamaService

```javascript
import { OllamaService } from '../services/OllamaService';

const ollamaService = new OllamaService();

// Enviar mensagem
const response = await ollamaService.sendMessage(
  "Explique a teoria da relatividade",
  { temperature: 0.7 }
);

// Verificar status
const status = await ollamaService.checkServiceStatus();

// Listar modelos
const models = await ollamaService.listAvailableModels();

// Baixar modelo
await ollamaService.downloadModel('llama2:latest', (progress) => {
  console.log(`Download: ${progress.completed}/${progress.total}`);
});
```

### Repositório Direto

```javascript
import { OllamaApiRepository } from '../infrastructure/api/OllamaApiRepository';

const repository = new OllamaApiRepository();

// Requisição customizada
const models = await repository.listModels();

// Configuração customizada
const config = new OllamaConfig(
  'http://localhost:11434',
  30000,
  'llama2:latest',
  true
);
await repository.saveConfig(config);
```

## Limitações e Considerações

### Performance
- Modelos grandes podem ser lentos em hardware limitado
- Primeira execução pode levar mais tempo (carregamento do modelo)
- Timeout configurável para evitar travamentos

### Compatibilidade
- Requer OLLAMA v0.1.0 ou superior
- Funciona apenas com modelos suportados pelo OLLAMA
- Browsers modernos com suporte a fetch API

### Segurança
- Comunicação apenas com localhost por padrão
- Configurações salvas localmente (sem servidor)
- Nenhum dado sensível transmitido para serviços externos

### Recursos
- Uso intensivo de CPU/GPU durante inferência
- Modelos ocupam espaço significativo em disco
- Memória RAM necessária proporcional ao tamanho do modelo

## Solução de Problemas

### OLLAMA não conecta

1. Verificar se o serviço está rodando: `ollama list`
2. Conferir a URL configurada
3. Verificar firewall/antivírus
4. Testar endpoint manualmente: `curl http://localhost:11434/api/version`

### Modelo não encontrado

1. Listar modelos disponíveis: `ollama list`
2. Baixar modelo necessário: `ollama pull nome:tag`
3. Atualizar lista no XandAI
4. Selecionar modelo correto

### Performance lenta

1. Verificar recursos do sistema (CPU/GPU/RAM)
2. Usar modelos menores para hardware limitado
3. Ajustar parâmetros de temperatura e tokens
4. Considerar quantização mais agressiva

### Fallback frequente

1. Verificar logs do console para erros
2. Testar conexão manual
3. Validar configuração
4. Reiniciar serviço OLLAMA
