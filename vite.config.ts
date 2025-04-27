import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use root-relative paths for assets
  base: '/',
  
  // Optimize asset handling for production
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // Don't inline any assets as base64
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog']
        },
        // Ensure consistent asset file naming
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    },
    sourcemap: true,
    // Explicitly copy the public directory
    copyPublicDir: true,
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
