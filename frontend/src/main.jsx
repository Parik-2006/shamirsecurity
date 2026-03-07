import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import QuantumAppRouter from './QuantumAppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QuantumAppRouter />
    </BrowserRouter>
  </StrictMode>
);
