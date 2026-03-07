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
        '/api': 'https://congenial-journey-v6jg9xv764q4h75p-8080.app.github.dev', // Proxy API requests to Flask backend (hosted/prod)
    },
  },
})
