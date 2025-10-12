// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  css: [join(currentDir, './assets/styles/main.css')],
  runtimeConfig: {
    apiSecret: "",
    public: {
      apiBase: "http://localhost:3001/"
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
