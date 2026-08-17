import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["node_modules", ".next", "convex/_generated"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["convex/_generated/**", "**/*.config.*"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
      "@convex": path.resolve(dirname, "./convex"),
    },
  },
});
