import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import QuantumAppRouter from './QuantumAppRouter.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuantumAppRouter />
  </StrictMode>
);
