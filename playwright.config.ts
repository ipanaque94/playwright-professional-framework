import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/junit-results.xml" }], // ← CRÍTICO
  ],

  use: {
    baseURL:
      process.env.BASE_URL ||
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "ui-tests",
      testMatch: /tests\/ui\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api-tests",
      testMatch: /tests\/api\/.*\.spec\.ts$/,
    },
    {
      name: "e2e-tests",
      testMatch: /tests\/e2e\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "integration-tests",
      testMatch: /tests\/integration\/.*\.spec\.ts$/,
    },
    {
      name: "contract-tests",
      testMatch: /tests\/contract\/.*\.spec\.ts$/,
    },
    {
      name: "performance-tests",
      testMatch: /tests\/performance\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "security-tests",
      testMatch: /tests\/security\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "accessibility-tests",
      testMatch: /tests\/accessibility\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual-tests",
      testMatch: /tests\/visual\/.*\.spec\.ts$/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
