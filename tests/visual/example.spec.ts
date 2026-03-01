import { test, expect } from "@playwright/test";

test.describe("Example Tests", () => {
  test("Example 001 - Basic navigation", async ({ page }) => {
    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );
    await expect(page).toHaveTitle(/Sandbox/i);
  });
});
