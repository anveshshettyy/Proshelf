import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://proshelf.onrender.com',
        changeOrigin: true,
        secure: true, // Changed to true for production
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  define: {
    // Optional: Define environment variables that will be available in your client-side code
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://proshelf.onrender.com')
  }
})
