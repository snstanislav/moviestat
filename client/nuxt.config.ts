// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  //css: [join(currentDir, './assets/styles/main.css')],
  css: ['~/assets/styles/main.scss'],
  vite: {
    build: {
      cssCodeSplit: false
    }
  },
  runtimeConfig: {
    apiSecret: "",
    public: {
      apiBase: process.env.NODE_ENV === "production" ? "https://moviestat-0sul.onrender.com" : "http://localhost:3001"
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
