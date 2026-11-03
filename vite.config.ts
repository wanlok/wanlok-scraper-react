import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// In dev, /api is proxied to the phone (IP_ADDRESS and PORT in .env.local).
// In production the build is served by the phone itself, so /api is same-origin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const ipAddress = env.IP_ADDRESS || "localhost";
  const port = env.PORT || "8080";

  return {
    plugins: [react()],
    // Relative asset paths, so the build works wherever the phone serves it from.
    base: "./",
    server: {
      proxy: {
        "/api": { target: `http://${ipAddress}:${port}`, changeOrigin: true },
      },
    },
  };
});
