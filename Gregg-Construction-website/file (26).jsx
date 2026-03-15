/**
 * Gregg Construction - Main Application Component
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import AppRoutes from './routes';

import './styles/index.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#FEFDFB',
                borderRadius: '0',
              },
              success: {
                iconTheme: {
                  primary: '#D4AF37',
                  secondary: '#1A1A1A',
                },
              },
            }}
          />
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
