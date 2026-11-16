// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://mshardul.github.io',
  // GitHub Pages user site is served from the repo root, so no base path.
  // Add a custom domain later with a redirect; the static build stays portable.
  base: '/',
  vite: {
    build: {
      // Keep the client bundle as an external file so the email parts and
      // mailto assembly never appear in the HTML source.
      assetsInlineLimit: 0,
    },
  },
});