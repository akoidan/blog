import { defineConfig } from 'astro/config';
import config from "./src/config.json";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: config.domain,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true
    }
  },
  integrations: [sitemap(), tailwind({
    config: {
      applyBaseStyles: false
    }
  }), image()]
});