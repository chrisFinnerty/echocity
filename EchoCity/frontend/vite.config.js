import { defineConfig } from 'vite'
import { configDotenv } from 'dotenv';
configDotenv();
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTest.js'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_SUPABASE_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: process.env.VITE_SUPABASE_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
