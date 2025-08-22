# XandAI - Chat Interface with React and Material-UI

## 📖 Overview

XandAI is a responsive and modern chat interface developed with React and Material-UI, designed for interactions with LLMs (Large Language Models) and image generation capabilities. The project follows Clean Code and Clean Architecture principles, offering an intuitive user experience and maintainable codebase.

## ✨ Key Features

- **Responsive Interface**: Works perfectly on desktop, tablet and mobile
- **Modern Design**: Clean interface using Material-UI with custom theme
- **Clean Architecture**: Clear separation of responsibilities and organized code
- **Mock API**: AI response simulation for development and testing
- **Real-time UX**: Typing indicators and smooth animations
- **Custom Theme**: Consistent design system with XandAI colors and typography
- **Image Generation**: Integration with Stable Diffusion for image creation
- **Chat History**: Persistent conversations with backend storage
- **Authentication**: User login and profile management

## 🏗️ Architecture

The project follows Clean Architecture, organizing code in well-defined layers:

```
src/
├── domain/                 # Domain Layer
│   ├── entities/          # Business entities
│   └── repositories/      # Repository interfaces
├── infrastructure/        # Infrastructure Layer
│   ├── api/              # API implementations
│   └── mock-api/         # Mock API implementations
├── application/           # Application Layer
│   ├── services/         # Application services
│   └── hooks/            # Custom hooks
├── components/           # Presentation Layer
│   ├── chat/            # Chat-specific components
│   ├── auth/            # Authentication components
│   ├── settings/        # Settings components
│   └── common/          # Reusable components
└── styles/              # Styles and themes
    └── theme/           # Material-UI theme configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd XandAI
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

4. Access the application at `http://localhost:3000`

## 📱 Features

### Chat Interface

- **Real-time Messages**: Send and receive messages with visual feedback
- **Typing Indicator**: Shows when XandAI is processing a response
- **Conversation History**: Maintains message history from session
- **Chat Clearing**: Option to clear all history
- **Timestamps**: Send time for each message
- **Avatars**: Clear visual identification between user and AI
- **Image Generation**: Generate images from chat responses
- **Attachments**: View generated images in chat history

### Responsiveness

- **Adaptive Layout**: Interface optimized for different screen sizes
- **Touch-Friendly**: Buttons and touch areas suitable for mobile devices
- **Intuitive Navigation**: Hamburger menu on mobile devices
- **Scalable Typography**: Font sizes that adjust to device

### User Experience

- **Smooth Animations**: Transitions and animations that improve performance perception
- **Visual Feedback**: Loading, error and success states clearly indicated
- **Informative Tooltips**: Usage tips on buttons and features
- **Error Handling**: Friendly error messages and recovery actions

## 🛠️ Technologies Used

### Core
- **React 19.1.1**: Main library for interface construction
- **Material-UI 7.3.1**: Design system and UI components
- **Emotion**: CSS-in-JS library for styling

### Development
- **React Scripts**: Configuration and build tools
- **Testing Library**: Tools for automated testing
- **Web Vitals**: Application performance metrics

## 📊 Component Structure

### Main Components

#### `ChatContainer`
Main container that orchestrates the entire chat interface.

**Responsibilities:**
- Global chat state management
- Coordination between header, message list and input
- Error handling and confirmation dialogs

#### `ChatHeader`
Chat header with XandAI information and actions.

**Features:**
- Bot status (online/typing)
- Message counter
- Clear and refresh chat actions
- Mobile menu

#### `MessageList`
Message list with auto-scroll and welcome screen.

**Characteristics:**
- Auto-scroll for new messages
- Welcome screen for new users
- Date dividers
- Performance optimization for many messages

#### `ChatMessage`
Individual component for each message.

**Elements:**
- Styled message bubble
- Sender avatar
- Formatted timestamp
- Animated typing indicator
- Image attachments display

#### `MessageInput`
Input field with advanced features.

**Resources:**
- Multiline input with auto-resize
- Action buttons (send, attach, emoji, audio)
- Loading and disabled states
- Keyboard shortcut support

#### `GenerateImageButton`
Component for generating images from text.

**Features:**
- Extract prompts from chat responses
- Integration with Stable Diffusion
- Loading states and error handling
- Attachment to chat messages

## 🎨 Design System

### Color Palette

```javascript
// Primary Colors
primary: '#1976d2'      // XandAI main blue
secondary: '#9c27b0'    // Secondary purple
background: '#f5f5f5'   // Default background
paper: '#ffffff'        // Card/paper background

// States
success: '#4caf50'      // Green for success
error: '#f44336'        // Red for errors
warning: '#ff9800'      // Orange for warnings
info: '#2196f3'         // Blue for information
```

### Typography

- **Main Font**: Roboto
- **Hierarchy**: H1-H6 with defined weights and sizes
- **Responsiveness**: Adaptive sizes per breakpoint
- **Readability**: Optimized line-height for reading

### Spacing

- **8px System**: Multiples of 8 for consistency
- **Breakpoints**: xs, sm, md, lg, xl
- **Grid System**: Flexible and responsive layout

## 🔧 Configuration and Customization

### Theme

The theme can be customized in `src/styles/theme/theme.js`:

```javascript
// Customize colors
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#your-color-here',
    },
  },
});
```

### Mock API

Mock responses can be customized in `src/infrastructure/mock-api/MockChatRepository.js`:

```javascript
// Add new responses
this.mockResponses = [
  "Your custom response here",
  // ... more responses
];
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Structure

```
src/
├── __tests__/           # Unit tests
├── components/
│   └── __tests__/       # Component tests
└── application/
    └── __tests__/       # Business logic tests
```

## 📈 Performance

### Implemented Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo on frequently re-rendering components
- **Virtual Scrolling**: For large message lists
- **Bundle Analysis**: Bundle size optimization

### Web Vitals Metrics

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🔒 Security

### Implemented Best Practices

- **XSS Prevention**: Input sanitization
- **Content Security Policy**: Security headers
- **Dependency Security**: Regular dependency auditing
- **Data Validation**: Input validation at all layers

## 🌐 Accessibility

### WCAG Compliance

- **Contrast**: Adequate contrast ratios
- **Keyboard Navigation**: Full support
- **Screen Readers**: ARIA labels and roles
- **Focus Management**: Logical focus order

## 📦 Build and Deploy

### Production Build

```bash
npm run build
```

### Environment Variables

```bash
# .env.production
REACT_APP_API_URL=https://api.xandai.com
REACT_APP_VERSION=1.0.0
REACT_APP_BACKEND_URL=https://backend.xandai.com
```

## 🤝 Contributing

### Development Flow

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- **ESLint**: Configuration for React
- **Prettier**: Automatic formatting
- **Conventional Commits**: Standardized commit messages
- **Code Review**: Mandatory for changes

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 🆘 Support

### Additional Documentation

- [Component Guide](./components.md)
- [Detailed Architecture](./architecture.md)
- [API Reference](./api.md)
- [Troubleshooting](./troubleshooting.md)

### Contact

- **Email**: support@xandai.com
- **Issues**: [GitHub Issues](https://github.com/XandAI-project/XandAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/XandAI-project/XandAI/discussions)

---

Developed with ❤️ by the XandAI team