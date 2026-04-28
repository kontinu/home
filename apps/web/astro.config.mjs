import { defineConfig } from "astro/config";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 4321
  },
  preview: {
    host: "0.0.0.0",
    port: 4321
  }
});
