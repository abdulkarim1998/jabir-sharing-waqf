import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/waqf',
  server: {
    host: '0.0.0.0',
    port: 3000,
    // origin: 'http://localhost/waqf',
    hmr: {
      host: 'localhost',
      path: '/waqf',
      clientPort: 80,
      port: 3000,
    },
    proxy: {
      '/api': 'http://api:80',
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
