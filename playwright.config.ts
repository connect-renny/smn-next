import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);

/**
 * Smoke tests in a real browser. Uses the Chrome already installed on the
 * machine (no browser download). Reuses a running `npm run dev`; otherwise
 * starts one.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1920, height: 1000 },
      },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "npm run dev",
    url: `http://localhost:${port}/en`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
