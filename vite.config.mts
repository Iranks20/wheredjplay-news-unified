import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
        },
      },
    },
    target: 'es2015',
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  define: {
    'process.env': {}
  },
  // Add base path for subdirectory deployment
  base: '/wdjpnews/'
})
