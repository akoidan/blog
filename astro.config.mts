import {defineConfig} from 'astro/config';
import config from "./src/config.json";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import robotsTxt from 'astro-robots-txt';
import vue from "@astrojs/vue";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: config.domain,
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true
    }
  },
  integrations: [
    robotsTxt(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    image(),
    vue(),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ]
});
