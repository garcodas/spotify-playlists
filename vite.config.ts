import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";
import history from "connect-history-api-fallback";
import { Connect } from "vite";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "configure-server",
      configureServer(server) {
        server.middlewares.use(
          history({
            disableDotRule: true,
            htmlAcceptHeaders: ["text/html"],
            rewrites: [
              {
                from: /^\/@vite\//,
                to: (ctx) => ctx.parsedUrl.pathname || "/",
              }, // permite archivos de Vite
            ],
          }) as Connect.NextHandleFunction
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["zod", "react-hook-form"],
  },
  base: "/",
  define: {
    "process.env": process.env,
  },
  build: {
    outDir: "dist",
  },
});
