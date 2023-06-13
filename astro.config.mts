import { defineConfig } from 'astro/config';
import config from "./src/config.json";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import robotsTxt from 'astro-robots-txt';
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: config.domain,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true
    }
  },
  integrations: [robotsTxt(), sitemap(), tailwind({
    config: {
      applyBaseStyles: false
    }
  }), image(), vue()]
});
