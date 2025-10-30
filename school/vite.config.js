import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = (env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '')

  return {
    plugins: [react()],
    server: {
      // Use 3002 to match the port Vite chose when 3001 was occupied
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
