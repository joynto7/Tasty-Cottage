import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Keep this line for React support
import tailwindcss from '@tailwindcss/vite' // Add this line for Tailwind CSS support

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), // Keep the React plugin
    tailwindcss(), // Add the Tailwind CSS plugin
  ],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for segment analytics lib to work
    global: {},
  },
  resolve: {
    alias: {
      events: 'events',
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
})