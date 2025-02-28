import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173, // Default port for Vite
    strictPort: false, // Allow fallback to another port if 5173 is in use
    host: true, // Listen on all addresses
    // Proxy API requests to the original backend during development
    proxy: {
      // Proxy API requests to the original backend during development
      '/api': {
        target: 'http://localhost:5000', // Assuming original backend is on port 5000
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    exclude: ['@sendgrid/mail'] // Exclude server-only packages
  },
  // Environment variable handling
  envPrefix: ['VITE_', 'PUBLIC_'], // Only expose env vars with these prefixes to the client
  // Enable source maps in production for debugging if needed
  build: {
    sourcemap: true
  }
});