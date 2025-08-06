// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';

// 환경별 설정
const isProduction = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://bathorys.github.io',
  // GitHub Pages 배포 시에만 base 경로 설정
  base: isGitHubPages ? '/Image-Generator' : undefined,
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
