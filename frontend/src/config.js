// Centralized config for environment variables

const API_URL = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : 'https://shamirsecurity-098.onrender.com';

export { API_URL };
