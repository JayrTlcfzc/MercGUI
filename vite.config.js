import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['./']
    }
  },
  base: '/demoapp-merchant/',// Ensures correct asset paths
  assetsInclude: ['**/*.xlsx'],
});
