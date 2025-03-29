// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  env: {
    schema: {
      URL_BACKEND: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },

  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});