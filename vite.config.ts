import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  base: '/simple-reddit',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
  },
});
