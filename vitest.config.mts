import { defineConfig } from "vitest/config";

// Unit tests only (plain data and functions — no React rendering needed).
// Browser tests live in tests/e2e and run with Playwright (`npm run test:e2e`).
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
