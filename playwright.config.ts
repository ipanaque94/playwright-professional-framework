import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,

  reporter: [
    ["html", { outputFolder: "reports/html-report", open: "never" }],
    ["json", { outputFile: "reports/test-results.json" }],
    ["junit", { outputFile: "reports/junit-results.xml" }],
    ["list"],
  ],

  use: {
    baseURL:
      process.env.BASE_URL ||
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },

  projects: [
    // ==================== UI TESTS ====================
    {
      name: "ui-tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/ui/**/*.spec.ts", // ✅ Detecta sandbox.spec.ts
    },

    // ==================== API TESTS ====================
    {
      name: "api-tests",
      testMatch: "**/api/**/*.spec.ts", // ✅ Detecta posts.api.spec.ts
      use: {
        baseURL: "https://jsonplaceholder.typicode.com",
      },
    },

    // ==================== E2E TESTS ====================
    {
      name: "e2e-tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/e2e/**/*.spec.ts", // ✅ Detecta complete-flow.spec.ts
    },

    // ==================== INTEGRATION TESTS ====================
    {
      name: "integration-tests",
      testMatch: "**/integration/**/*.spec.ts", // ✅ Detecta api-integration.spec.ts
    },

    // ==================== CONTRACT TESTS ====================
    {
      name: "contract-tests",
      testMatch: "**/contract/**/*.spec.ts", // ✅ Detecta api-contract.spec.ts
    },

    // ==================== PERFORMANCE TESTS ====================
    {
      name: "performance-tests",
      testMatch: "**/performance/**/*.spec.ts", // ✅ Detecta load-test.spec.ts
    },

    // ==================== SECURITY TESTS ====================
    {
      name: "security-tests",
      testMatch: "**/security/**/*.spec.ts", // ✅ Detecta xss.spec.ts, sql-injection.spec.ts
    },

    // ==================== ACCESSIBILITY TESTS ====================
    {
      name: "accessibility-tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/accessibility/**/*.spec.ts", // ✅ Detecta wcag.spec.ts
    },

    // ==================== VISUAL TESTS ====================
    {
      name: "visual-tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/visual/**/*.spec.ts",
    },
  ],
});
