import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) return 'react';
          if (id.includes('node_modules/firebase/')) return 'firebase';
          if (id.includes('node_modules/framer-motion/')) return 'motion';
          if (id.includes('node_modules/@tanstack/react-query/')) return 'query';
        },
      },
    },
  },
  // vite.config.js
  server: {
    host: '0.0.0.0' // Expose on all network interfaces
  }


})
