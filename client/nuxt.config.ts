// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  css: [join(currentDir, './assets/styles/main.css')],
  vite: {
    build: {
      cssCodeSplit: false
    }
  },
  runtimeConfig: {
    apiSecret: "",
    public: {
      apiBase: "https://moviestat.vercel.app"
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
