import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5147,
    proxy: {
      "/api": "http://localhost:3001",
      "/user": "http://localhost:3001",
      "/upload": "http://localhost:3001"
    }
  }
});
