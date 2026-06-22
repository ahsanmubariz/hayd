import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import { fileURLToPath } from 'node:url';

const isCloudflare = (process.env.DEPLOY_TARGET ?? 'cloudflare') === 'cloudflare';

export default defineConfig({
  srcDir: './src',
  output: 'server',
  adapter: isCloudflare
    ? cloudflare()
    : node({ mode: 'standalone' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  security: {
    checkOrigin: true,
  },
});
