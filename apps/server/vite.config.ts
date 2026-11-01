import { defineConfig } from "vite";

export default defineConfig({
  build: {
    sourcemap: true,
    ssr: "src/index.ts",
    target: "node24"
  },
  resolve: {
    tsconfigPaths: true
  }
});
