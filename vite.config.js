import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  base: '/englishman/', // name of repository

  server: {
    host: true, // open server on localhost
    port: 5173, 
  }
  
})