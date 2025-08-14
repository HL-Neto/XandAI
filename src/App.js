import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './styles/theme/theme';
import ChatContainer from './components/chat/ChatContainer';

/**
 * Componente principal da aplicação XandAI
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ChatContainer />
    </ThemeProvider>
  );
}

export default App;