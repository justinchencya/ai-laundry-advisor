import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true, // Don't try other ports if 5173 is taken
    hmr: {
      clientPort: 5173 // Force the client to use this port for HMR
    }
  }
})
