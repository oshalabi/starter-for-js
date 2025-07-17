import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/',
  server: {
    host: true,         
    port: 5173,
    strictPort: true,
    cors: true,
  },
  plugins: [tailwindcss()],
});