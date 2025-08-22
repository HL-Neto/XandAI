# XandAI Backend

Backend API para o XandAI Chat Application, construído com NestJS, TypeORM e Clean Architecture.

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**, organizando o código em camadas bem definidas:

```
src/
├── domain/                 # Entidades de negócio e interfaces
│   ├── entities/          # Entidades do domínio
│   └── repositories/      # Interfaces dos repositórios
├── application/           # Casos de uso e DTOs
│   ├── dto/              # Data Transfer Objects
│   └── use-cases/        # Lógica de negócio
├── infrastructure/       # Implementações técnicas
│   ├── database/         # Configuração do banco
│   └── repositories/     # Implementação dos repositórios
└── presentation/         # Interface HTTP
    ├── controllers/      # Controllers REST
    ├── guards/          # Guards de autenticação
    └── modules/         # Módulos do NestJS
```

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **SQLite** - Banco de dados para desenvolvimento
- **PostgreSQL** - Banco de dados para produção
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **class-validator** - Validação de dados

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o ambiente:
```bash
cp env.example .env
```

3. Edite o arquivo `.env` com suas configurações.

4. Crie a pasta para o banco SQLite:
```bash
mkdir data
```

## 🏃 Execução

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/v1/auth/register` - Registrar usuário
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Obter perfil
- `PUT /api/v1/auth/profile` - Atualizar perfil
- `PUT /api/v1/auth/change-password` - Alterar senha
- `GET /api/v1/auth/verify` - Verificar token

### Chat
- `POST /api/v1/chat/sessions` - Criar sessão de chat
- `GET /api/v1/chat/sessions` - Listar sessões
- `GET /api/v1/chat/sessions/:id` - Obter sessão com mensagens
- `PUT /api/v1/chat/sessions/:id` - Atualizar sessão
- `PUT /api/v1/chat/sessions/:id/archive` - Arquivar sessão
- `DELETE /api/v1/chat/sessions/:id` - Deletar sessão
- `POST /api/v1/chat/messages` - Enviar mensagem
- `GET /api/v1/chat/sessions/:id/messages` - Obter mensagens
- `POST /api/v1/chat/messages/search` - Buscar mensagens

## 🗃️ Banco de Dados

### Desenvolvimento (SQLite)
O banco SQLite é criado automaticamente em `data/xandai.sqlite`.

### Produção (PostgreSQL)
Configure as variáveis de ambiente:
```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=xandai
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 Entidades

### User
- `id` (UUID) - Identificador único
- `email` (string) - Email único
- `firstName` (string) - Primeiro nome
- `lastName` (string) - Sobrenome
- `password` (string) - Senha hasheada
- `role` (enum) - user | admin
- `theme` (enum) - light | dark
- `preferredLanguage` (string) - Idioma preferido
- `avatar` (string) - URL do avatar
- `isActive` (boolean) - Status ativo
- `lastLoginAt` (timestamp) - Último login
- `createdAt` (timestamp) - Data de criação
- `updatedAt` (timestamp) - Data de atualização

### ChatSession
- `id` (UUID) - Identificador único
- `userId` (UUID) - ID do usuário
- `title` (string) - Título da sessão
- `description` (string) - Descrição
- `status` (enum) - active | archived | deleted
- `metadata` (JSON) - Metadados da sessão
- `lastActivityAt` (timestamp) - Última atividade
- `createdAt` (timestamp) - Data de criação
- `updatedAt` (timestamp) - Data de atualização

### ChatMessage
- `id` (UUID) - Identificador único
- `chatSessionId` (UUID) - ID da sessão
- `content` (text) - Conteúdo da mensagem
- `role` (enum) - user | assistant | system
- `status` (enum) - sent | delivered | error | processing
- `metadata` (JSON) - Metadados da mensagem
- `error` (text) - Mensagem de erro
- `processedAt` (timestamp) - Data de processamento
- `createdAt` (timestamp) - Data de criação
- `updatedAt` (timestamp) - Data de atualização

## 🔄 Desenvolvimento

### Estrutura dos DTOs
- **AuthDto** - DTOs de autenticação
- **ChatDto** - DTOs de chat

### Use Cases
- **AuthUseCase** - Casos de uso de autenticação
- **ChatUseCase** - Casos de uso de chat

### Repositórios
- **UserRepository** - Operações de usuário
- **ChatSessionRepository** - Operações de sessão
- **ChatMessageRepository** - Operações de mensagem

## 🧪 Testes

```bash
npm run test
npm run test:watch
npm run test:cov
```

## 📝 Scripts

- `npm run start:dev` - Desenvolvimento com reload automático
- `npm run build` - Build para produção
- `npm run start:prod` - Execução em produção
- `npm run format` - Formatação de código

## 🚧 TODO

- [ ] Integração com Ollama
- [ ] WebSockets para chat em tempo real
- [ ] Rate limiting
- [ ] Logging estruturado
- [ ] Testes automatizados
- [ ] Documentação Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline
