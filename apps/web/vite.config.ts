// apps/web/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@gymtracker/api-client":      path.resolve(__dirname, "../../packages/api-client/src/index.ts"),
      "@gymtracker/constants":       path.resolve(__dirname, "../../packages/constants/src/index.ts"),
      "@gymtracker/stores":          path.resolve(__dirname, "../../packages/stores/src/index.ts"),
      "@gymtracker/types":           path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@gymtracker/hooks":           path.resolve(__dirname, "../../packages/hooks/src/index.ts"),
      "@gymtracker/tailwind-config": path.resolve(__dirname, "../../packages/tailwind-config"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target:       "http://localhost:8000",
        changeOrigin: true,
        rewrite:      (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});