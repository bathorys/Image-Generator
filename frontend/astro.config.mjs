// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: 'https://bathorys.github.io',
  // 개발 환경에서는 base 경로를 제거
  // base: '/Image-Generator',
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
