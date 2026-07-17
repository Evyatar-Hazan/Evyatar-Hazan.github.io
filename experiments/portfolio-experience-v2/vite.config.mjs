import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  build: {
    manifest: true,
  },
  resolve: {
    // MDX lives in the shared root content tree. Always resolve its React
    // runtime from this isolated app so a clean CI checkout does not depend on
    // a second node_modules directory at the repository root.
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [mdx(), react()],
});
