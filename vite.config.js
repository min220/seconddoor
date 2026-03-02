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
      "/api": "http://localhost:8787",
    },
  },
});