import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // Increase limit to suppress warning for large bundles
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to Flask backend (hosted/prod)
    },
  },
})
