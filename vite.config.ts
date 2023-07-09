import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';

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
  plugins: [
    eslintPlugin({
      fix: false,
      cache: false,
      failOnWarning: true,
    }),
  ],
});
