# XandAI Backend

Backend API for the XandAI Chat Application, built with NestJS, TypeORM and Clean Architecture.

## 🏗️ Architecture

The project follows **Clean Architecture** principles, organizing code in well-defined layers:

```
src/
├── domain/                 # Business entities and interfaces
│   ├── entities/          # Domain entities
│   └── repositories/      # Repository interfaces
├── application/           # Use cases and DTOs
│   ├── dto/              # Data Transfer Objects
│   └── use-cases/        # Business logic
├── infrastructure/       # Technical implementations
│   ├── database/         # Database configuration
│   ├── repositories/     # Repository implementations
│   └── services/         # External services (OLLAMA, Stable Diffusion)
└── presentation/         # HTTP interface
    ├── controllers/      # REST Controllers
    ├── guards/          # Authentication guards
    └── modules/         # NestJS modules
```

## 🚀 Technologies

- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **SQLite** - Database for development
- **PostgreSQL** - Database for production
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **class-validator** - Data validation
- **Passport** - Authentication middleware

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp env.example .env
```

3. Edit the `.env` file with your settings.

4. Create folder for SQLite database:
```bash
mkdir data
```

## 🏃 Running

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get profile
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/change-password` - Change password
- `GET /api/v1/auth/verify` - Verify token

### Chat
- `POST /api/v1/chat/sessions` - Create chat session
- `GET /api/v1/chat/sessions` - List sessions
- `GET /api/v1/chat/sessions/:id` - Get session with messages
- `PUT /api/v1/chat/sessions/:id` - Update session
- `PUT /api/v1/chat/sessions/:id/archive` - Archive session
- `DELETE /api/v1/chat/sessions/:id` - Delete session
- `POST /api/v1/chat/messages` - Send message
- `GET /api/v1/chat/sessions/:id/messages` - Get messages
- `POST /api/v1/chat/messages/search` - Search messages
- `POST /api/v1/chat/messages/:messageId/attachments/image` - Attach image to message

### Stable Diffusion
- `POST /api/v1/stable-diffusion/generate` - Generate image
- `GET /api/v1/stable-diffusion/models` - Get available models
- `GET /api/v1/stable-diffusion/status` - Check service status

## 🗃️ Database

### Development (SQLite)
The SQLite database is automatically created at `data/xandai.sqlite`.

### Production (PostgreSQL)
Configure environment variables:
```env
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=xandai
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 Entities

### User
- `id` (UUID) - Unique identifier
- `email` (string) - Unique email
- `firstName` (string) - First name
- `lastName` (string) - Last name
- `password` (string) - Hashed password
- `role` (enum) - user | admin
- `theme` (enum) - light | dark
- `preferredLanguage` (string) - Preferred language
- `avatar` (string) - Avatar URL
- `isActive` (boolean) - Active status
- `lastLoginAt` (timestamp) - Last login
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Update date

### ChatSession
- `id` (UUID) - Unique identifier
- `userId` (UUID) - User ID
- `title` (string) - Session title
- `description` (string) - Description
- `status` (enum) - active | archived | deleted
- `metadata` (JSON) - Session metadata
- `lastActivityAt` (timestamp) - Last activity
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Update date

### ChatMessage
- `id` (UUID) - Unique identifier
- `chatSessionId` (UUID) - Session ID
- `content` (text) - Message content
- `role` (enum) - user | assistant | system
- `status` (enum) - sent | delivered | error | processing
- `metadata` (JSON) - Message metadata
- `attachments` (JSON) - Message attachments (images, files)
- `error` (text) - Error message
- `processedAt` (timestamp) - Processing date
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Update date

## 🔄 Development

### DTO Structure
- **AuthDto** - Authentication DTOs
- **ChatDto** - Chat DTOs

### Use Cases
- **AuthUseCase** - Authentication use cases
- **ChatUseCase** - Chat use cases

### Repositories
- **UserRepository** - User operations
- **ChatSessionRepository** - Session operations
- **ChatMessageRepository** - Message operations

### Services
- **OllamaService** - OLLAMA integration
- **StableDiffusionService** - Stable Diffusion integration

## 🧪 Testing

```bash
npm run test
npm run test:watch
npm run test:cov
```

## 📝 Scripts

- `npm run start:dev` - Development with auto reload
- `npm run build` - Production build
- `npm run start:prod` - Production execution
- `npm run format` - Code formatting
- `npm run lint` - Code linting

## 🌐 External Integrations

### OLLAMA
The backend can integrate with OLLAMA for local AI models:
- Model management
- Streaming responses
- Error handling and fallbacks

### Stable Diffusion
Integration with Stable Diffusion WebUI:
- Image generation from prompts
- Model selection
- Parameter configuration
- Image storage and serving

## 🚧 TODO

- [ ] WebSockets for real-time chat
- [ ] Rate limiting
- [ ] Structured logging
- [ ] Automated testing
- [ ] Swagger documentation
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Redis caching
- [ ] File upload handling
- [ ] Email notifications

## 🐳 Docker

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Metrics endpoint: `GET /metrics`
- API documentation: `GET /api/docs` (Swagger)

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Rate limiting (planned)
- SQL injection prevention

## 📈 Performance

- Database indexing
- Connection pooling
- Query optimization
- Caching strategies (planned)
- Compression middleware

## 🌍 Environment Variables

```env
# Application
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
DB_TYPE=sqlite
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=xandai
DB_SYNCHRONIZE=true

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# External Services
OLLAMA_BASE_URL=http://localhost:11434
STABLE_DIFFUSION_BASE_URL=http://localhost:7860

# File Storage
UPLOAD_DEST=./public/images
MAX_FILE_SIZE=10485760
```

## 📖 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3001/api/docs`
- JSON Schema: `http://localhost:3001/api/docs-json`

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.