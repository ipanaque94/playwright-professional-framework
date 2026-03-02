import { test, expect } from "@playwright/test";
import { Logger } from "../../utils/reporting/Logger";

test.describe("API Mocking Tests", () => {
  test("MOCK001 - Interceptar API y agregar dato", async ({ page }) => {
    Logger.testStart("MOCK001");

    await test.step("Interceptar y modificar API", async () => {
      await page.route("*/**/api/v1/fruits", async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        json.push({ name: "Lionel Messi", id: 200 });
        await route.fulfill({ response, json });
      });

      await page.goto("https://demo.playwright.dev/api-mocking");

      await expect(
        page.getByText("Lionel Messi", { exact: true }),
        "Elemento mockeado no apareció",
      ).toBeVisible();
    });

    Logger.testEnd("MOCK001", "PASSED");
  });

  test("MOCK002 - Mockear respuesta completa", async ({ page }) => {
    Logger.testStart("MOCK002");

    await test.step("Mockear API con datos personalizados", async () => {
      await page.route("*/**/api/v1/fruits", (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { name: "Manzana Mockeada", id: 1 },
            { name: "Banana Falsa", id: 2 },
            { name: "Uva Simulada", id: 3 },
          ]),
        });
      });

      await page.goto("https://demo.playwright.dev/api-mocking");

      await expect(
        page.getByText("Manzana Mockeada"),
        "Primera fruta mockeada no apareció",
      ).toBeVisible();
      await expect(
        page.getByText("Banana Falsa"),
        "Segunda fruta mockeada no apareció",
      ).toBeVisible();
    });

    Logger.testEnd("MOCK002", "PASSED");
  });
});
