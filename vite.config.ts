import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ``,
      },
    },
  },
  resolve: {
    alias: {
      $fonts: resolve('public/fonts/'),
    },
  },
  plugins: [],
});
