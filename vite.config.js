import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { routeEnglishman } from './src/App.jsx';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  base: `${routeEnglishman}/`, // name of repository
  
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'i18n': ['i18next', 'react-i18next'],
        }
      }
    }
  },

  server: {
    host: true, // open server on localhost
    port: 5173, 
    headers: {
      "Content-Security-Policy": "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:;"
    }
  }
  
})