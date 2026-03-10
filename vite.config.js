import { defineConfig } from "vite";

export default defineConfig({
  // Use relative asset paths so built files render correctly when opened directly.
  base: "./",
  server: {
    port: 3000,
    strictPort: true,
    allowedHosts: ["milanforcaptain.uk"],
    // Prevent stale assets during development.
    headers: {
      "Cache-Control": "no-store"
    },
    // More reliable file-change detection across networked filesystems/proxies.
    watch: {
      usePolling: true,
      interval: 150
    }
  }
});
