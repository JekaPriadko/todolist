import { defineConfig } from 'vite';
import { resolve } from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
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
    stylelint({
      dev: true,
      fix: false,
      cache: false,
      include: ['./src/**/*.{css,scss,sass,less,styl,vue,svelte}'],
    }),
  ],
});
