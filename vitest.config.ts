import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
    setupFiles: [],
    pool: 'threads',
    singleThread: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(new URL('./', import.meta.url)), './'),
    },
  },
});
