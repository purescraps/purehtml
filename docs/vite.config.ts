import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server:
    process.env.NODE_ENV === 'production'
      ? {
          origin: 'https://purescraps.github.com',
        }
      : undefined,
  base: process.env.NODE_ENV === 'production' ? '/purehtml' : undefined,
});
