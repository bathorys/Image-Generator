// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "${path.resolve('./src/styles/base/_variables.scss')}";`
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@/styles': path.resolve('./src/styles'),
        '@/js': path.resolve('./src/js'),
        '@/components': path.resolve('./src/components')
      }
    }
  }
});
