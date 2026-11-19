import { defineConfig } from 'waku/config';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages serves the project site under /purehtml/.
  basePath: process.env.NODE_ENV === 'production' ? '/purehtml/' : '/',
  vite: {
    resolve: {
      tsconfigPaths: true,
      dedupe: ['waku'],
    },
    plugins: [tailwindcss(), fumadocsMdx()],
  },
});
