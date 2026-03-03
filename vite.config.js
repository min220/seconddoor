import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@entities": path.resolve(__dirname, "./entities"),
    },
  },
  server: {
    proxy: {
  "/api/health": "http://localhost:8787",
  "/api/rentals": "http://localhost:8787",
},
  },
});