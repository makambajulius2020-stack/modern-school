import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = (env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '')

  return {
    plugins: [react()],
    // ADD THIS BASE CONFIG:
    base: '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    server: {
      port: 3002,
      host: true,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
