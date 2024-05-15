import { MantineProvider, createTheme } from '@mantine/core';
import { Router } from '@react-nano/router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import '@mantine/core/styles.css';

import '@mantine/code-highlight/styles.css';

import './index.css';

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>
);
