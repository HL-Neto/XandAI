import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Paper,
  useTheme,
  Chip
} from '@mui/material';
import {
  Code as CodeIcon,
  Link as LinkIcon,
  List as ListIcon,
  FormatQuote as QuoteIcon
} from '@mui/icons-material';

/**
 * Componente para renderização de markdown com estilos Material-UI
 * @param {Object} props - Propriedades do componente
 * @param {string} props.content - Conteúdo markdown para renderizar
 * @param {boolean} props.isUserMessage - Se é uma mensagem do usuário
 * @returns {JSX.Element}
 */
const MarkdownRenderer = ({ content, isUserMessage = false }) => {
  const theme = useTheme();

  // Detecta se o tema é escuro - verifica tanto o modo quanto a cor de fundo
  const isDarkMode = theme.palette.mode === 'dark' || 
                     theme.palette.background.default === '#121212';
  
  // Cores baseadas no tema e tipo de mensagem
  const colors = {
    text: isUserMessage ? theme.palette.primary.contrastText : theme.palette.text.primary,
    textSecondary: isUserMessage 
      ? 'rgba(255,255,255,0.8)' 
      : theme.palette.text.secondary,
    codeBackground: isUserMessage 
      ? 'rgba(255,255,255,0.1)' 
      : isDarkMode 
        ? theme.palette.grey[800] 
        : theme.palette.grey[100],
    codeBorder: isUserMessage 
      ? 'rgba(255,255,255,0.2)' 
      : isDarkMode 
        ? theme.palette.grey[700] 
        : theme.palette.grey[300],
    linkColor: isUserMessage 
      ? theme.palette.secondary.light 
      : isDarkMode 
        ? theme.palette.primary.light
        : theme.palette.primary.main,
    quoteBackground: isUserMessage 
      ? 'rgba(255,255,255,0.05)' 
      : isDarkMode 
        ? theme.palette.grey[900] 
        : theme.palette.grey[50],
    quoteBorder: isUserMessage 
      ? 'rgba(255,255,255,0.3)' 
      : isDarkMode 
        ? theme.palette.grey[600] 
        : theme.palette.grey[400],
    tableHeaderBg: isUserMessage 
      ? 'rgba(255,255,255,0.1)' 
      : isDarkMode 
        ? theme.palette.grey[800] 
        : theme.palette.grey[200],
    tableRowBg: isUserMessage 
      ? 'rgba(255,255,255,0.02)' 
      : isDarkMode 
        ? theme.palette.grey[900] 
        : theme.palette.grey[50]
  };

  // Componentes customizados para elementos markdown
  const components = {
    // Parágrafos
    p: ({ children, ...props }) => (
      <Typography 
        variant="body1" 
        component="p" 
        sx={{ 
          mb: 1.5, 
          lineHeight: 1.6,
          color: colors.text,
          '&:last-child': { mb: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    // Títulos
    h1: ({ children, ...props }) => (
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 2, 
          mt: 1.5,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    h2: ({ children, ...props }) => (
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 1.5, 
          mt: 1.5,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    h3: ({ children, ...props }) => (
      <Typography 
        variant="h6" 
        component="h3" 
        sx={{ 
          mb: 1, 
          mt: 1.5,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    h4: ({ children, ...props }) => (
      <Typography 
        variant="subtitle1" 
        component="h4" 
        sx={{ 
          mb: 1, 
          mt: 1,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    h5: ({ children, ...props }) => (
      <Typography 
        variant="subtitle2" 
        component="h5" 
        sx={{ 
          mb: 0.5, 
          mt: 1,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    h6: ({ children, ...props }) => (
      <Typography 
        variant="body1" 
        component="h6" 
        sx={{ 
          mb: 0.5, 
          mt: 1,
          fontWeight: 600,
          color: colors.text,
          '&:first-of-type': { mt: 0 }
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    // Texto em negrito
    strong: ({ children, ...props }) => (
      <Box 
        component="strong" 
        sx={{ 
          fontWeight: 700,
          color: colors.text 
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // Texto em itálico
    em: ({ children, ...props }) => (
      <Box 
        component="em" 
        sx={{ 
          fontStyle: 'italic',
          color: colors.text 
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // Código inline
    code: ({ node, inline, children, className, ...props }) => {
      const isInline = inline;
      
      if (isInline) {
        return (
          <Box
            component="code"
            sx={{
              backgroundColor: colors.codeBackground,
              border: `1px solid ${colors.codeBorder}`,
              borderRadius: 1,
              px: 0.5,
              py: 0.25,
              fontSize: '0.875rem',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              color: colors.text,
              whiteSpace: 'pre-wrap'
            }}
            {...props}
          >
            {children}
          </Box>
        );
      }

      // Bloco de código
      const language = className ? className.replace('language-', '') : 'código';
      
      return (
        <Paper
          elevation={1}
          sx={{
            mt: 1.5,
            mb: 1.5,
            overflow: 'hidden',
            backgroundColor: colors.codeBackground,
            border: `1px solid ${colors.codeBorder}`
          }}
        >
          {/* Header do bloco de código */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              backgroundColor: colors.tableHeaderBg,
              borderBottom: `1px solid ${colors.codeBorder}`
            }}
          >
            <CodeIcon fontSize="small" sx={{ color: colors.textSecondary }} />
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {language}
            </Typography>
          </Box>

          {/* Conteúdo do código */}
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              overflow: 'auto',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              color: colors.text,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {children}
          </Box>
        </Paper>
      );
    },

    // Listas não ordenadas
    ul: ({ children, ...props }) => (
      <List 
        dense 
        sx={{ 
          mt: 0.5,
          mb: 1.5,
          pl: 1,
          '& .MuiListItem-root': {
            py: 0.25,
            alignItems: 'flex-start'
          }
        }}
        {...props}
      >
        {children}
      </List>
    ),

    // Listas ordenadas
    ol: ({ children, ...props }) => (
      <List 
        dense 
        sx={{ 
          mt: 0.5,
          mb: 1.5,
          pl: 1,
          '& .MuiListItem-root': {
            py: 0.25,
            alignItems: 'flex-start'
          },
          listStyleType: 'decimal',
          listStylePosition: 'inside'
        }}
        {...props}
      >
        {children}
      </List>
    ),

    // Itens de lista
    li: ({ children, ...props }) => (
      <ListItem 
        disablePadding 
        sx={{ 
          display: 'list-item',
          listStyleType: 'inherit',
          listStylePosition: 'inside',
          mb: 0.5
        }}
        {...props}
      >
        <ListItemText
          primary={
            <Typography 
              variant="body1" 
              component="span" 
              sx={{ 
                color: colors.text,
                lineHeight: 1.6,
                ml: 0.5
              }}
            >
              {children}
            </Typography>
          }
          sx={{ m: 0 }}
        />
      </ListItem>
    ),

    // Links
    a: ({ children, href, ...props }) => (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: colors.linkColor,
          textDecoration: 'underline',
          '&:hover': {
            textDecoration: 'none'
          }
        }}
        {...props}
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          {children}
          <LinkIcon fontSize="small" />
        </Box>
      </Link>
    ),

    // Citações
    blockquote: ({ children, ...props }) => (
      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          mb: 1.5,
          pl: 2,
          pr: 2,
          py: 1.5,
          backgroundColor: colors.quoteBackground,
          borderLeft: `4px solid ${colors.quoteBorder}`,
          borderRadius: 1
        }}
        {...props}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <QuoteIcon 
            fontSize="small" 
            sx={{ 
              color: colors.textSecondary,
              mt: 0.5,
              flexShrink: 0
            }} 
          />
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
        </Box>
      </Paper>
    ),

    // Linha horizontal
    hr: ({ ...props }) => (
      <Divider 
        sx={{ 
          my: 2,
          borderColor: colors.quoteBorder 
        }}
        {...props}
      />
    ),

    // Tabelas
    table: ({ children, ...props }) => (
      <Box
        sx={{
          mt: 1.5,
          mb: 1.5,
          overflow: 'auto',
          borderRadius: 1,
          border: `1px solid ${colors.codeBorder}`
        }}
      >
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th, & td': {
              px: 1.5,
              py: 1,
              textAlign: 'left',
              borderBottom: `1px solid ${colors.codeBorder}`,
              color: colors.text
            },
            '& th': {
              backgroundColor: colors.tableHeaderBg,
              fontWeight: 600
            },
            '& tbody tr:nth-of-type(even)': {
              backgroundColor: colors.tableRowBg
            }
          }}
          {...props}
        >
          {children}
        </Box>
      </Box>
    )
  };

  return (
    <Box sx={{ '& > *:first-of-type': { mt: 0 }, '& > *:last-child': { mb: 0 } }}>
      <ReactMarkdown
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
