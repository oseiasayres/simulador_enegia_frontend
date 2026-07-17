import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Em produção o Caddy faz o proxy de /api para o backend (mesma origem).
  // No dev, o Vite reproduz isso para o front usar o mesmo caminho relativo.
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
