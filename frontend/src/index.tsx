import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './utils/errorLogger'; // Initialize error logger

const container = document.getElementById('root');
if (!container) {
  console.error('🚨 Root element not found! Make sure index.html has a div with id="root"');
  throw new Error('Root element not found');
}

const root = createRoot(container);

try {
  root.render(<App />);
  console.log('✅ React app rendered successfully');
} catch (error) {
  console.error('🚨 Failed to render React app:', error);
  throw error;
}