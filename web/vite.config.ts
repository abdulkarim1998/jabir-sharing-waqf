import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/waqf',
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      port: 3000,
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' && process.env.DOCKER === 'true' 
          ? 'http://server:8081' 
          : 'http://localhost:8081',
        changeOrigin: true,
      },
      '/auth': {
        target: 'https://keycloak-02.rihal.tech',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
    },
  },
  assetsInclude: ['**/*.mov'],
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
