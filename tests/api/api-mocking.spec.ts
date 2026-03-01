import { test, expect } from "@playwright/test";
import { Logger } from "../../utils/reporting/Logger";

test.describe("API Mocking Tests", () => {
  test("MOCK001 - Interceptar API y agregar dato personalizado", async ({
    page,
  }) => {
    Logger.testStart("MOCK001");

    await test.step("Interceptar y modificar respuesta de API", async () => {
      // Interceptamos la petición a la API de frutas
      await page.route("*/**/api/v1/fruits", async (route) => {
        // Obtenemos la respuesta real
        const response = await route.fetch();
        const json = await response.json();

        // Agregamos un elemento personalizado al array
        json.push({ name: "Lionel Messi", id: 200 });

        // Devolvemos la respuesta modificada
        await route.fulfill({ response, json });
      });
    });

    await test.step("Navegar a la página de demo", async () => {
      await page.goto("https://demo.playwright.dev/api-mocking");
    });

    await test.step("Verificar que el elemento mockeado aparece", async () => {
      await expect(
        page.getByText("Lionel Messi", { exact: true }),
        '❌ El elemento "Lionel Messi" no aparece en la lista - La intercepción de API falló',
      ).toBeVisible();
    });

    Logger.testEnd("MOCK001", "PASSED");
  });

  test("MOCK002 - Mockear respuesta completa de API", async ({ page }) => {
    Logger.testStart("MOCK002");

    await test.step("Mockear API con datos completamente personalizados", async () => {
      // Reemplazamos completamente la respuesta de la API
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
    });

    await test.step("Navegar a la página", async () => {
      await page.goto("https://demo.playwright.dev/api-mocking");
    });

    await test.step("Verificar que solo aparecen datos mockeados", async () => {
      await expect(
        page.getByText("Manzana Mockeada"),
        "❌ La fruta mockeada no apareció - El mock completo falló",
      ).toBeVisible();

      await expect(
        page.getByText("Banana Falsa"),
        "❌ La segunda fruta mockeada no apareció",
      ).toBeVisible();
    });

    Logger.testEnd("MOCK002", "PASSED");
  });
});
