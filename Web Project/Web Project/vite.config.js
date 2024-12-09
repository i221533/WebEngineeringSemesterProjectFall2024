import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Keep React plugin for JSX and Fast Refresh
  base: '/', // Set the base path for the project
  build: {
    outDir: 'dist', // Specify output directory for the production build
    sourcemap: true, // Enable source maps for debugging in production
  },
});
