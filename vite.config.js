import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";
dotenv.config();

const ApiUrl = process.env.VITE_BASE_URL;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    headers: {
      "X-Frame-Option": "SAMEORIGIN",
      SameSite: "Strict",
    },
    proxy: {
      "/api": {
        target: ApiUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
