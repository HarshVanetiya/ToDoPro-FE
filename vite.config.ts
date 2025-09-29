import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'https://todopro-be.onrender.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔄 [PROXY] Request:', req.method, req.url)
            console.log('🔄 [PROXY] Headers:', req.headers)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('🔄 [PROXY] Response:', proxyRes.statusCode, req.url)
            console.log('🔄 [PROXY] Set-Cookie:', proxyRes.headers['set-cookie'])
          })
        },
      },
    },
  },
})
