import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './styles/theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/auth/AuthGuard';
import ChatContainer from './components/chat/ChatContainer';

/**
 * Componente principal da aplicação XandAI
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <AuthGuard>
          <ChatContainer />
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;