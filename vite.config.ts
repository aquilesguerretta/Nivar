import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const DEFAULT_RAILWAY = 'https://gridalpha-v2-production.up.railway.app'
const LOCAL_EXPLORE_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "connect-src 'self' ws://127.0.0.1:*",
].join('; ')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The private Explore fixture runs without a backend, including auth hydration.
  const localExplore = mode === 'argos-local'
  const env = loadEnv(mode, process.cwd(), '')
  const target = (
    env.VITE_BACKEND_URL ||
    env.VITE_NEWS_API_URL ||
    DEFAULT_RAILWAY
  ).replace(/\/$/, '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: localExplore ? {
      host: '127.0.0.1',
      headers: { 'Content-Security-Policy': LOCAL_EXPLORE_POLICY },
    } : {
      proxy: {
        '/api': { target, changeOrigin: true, secure: true },
      },
    },
  }
})
