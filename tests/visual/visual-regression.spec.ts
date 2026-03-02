import { test, expect } from "@playwright/test";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Visual Regression Tests", () => {
  test("VIS001 - Homepage se ve correcta", async ({ page }) => {
    Logger.testStart("VIS001");

    await test.step("Capturar screenshot de homepage", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );

      await expect(page).toHaveScreenshot("sandbox-homepage.png", {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    Logger.testEnd("VIS001", "PASSED");
  });

  test("VIS002 - Botón dinámico mantiene estilo", async ({ page }) => {
    Logger.testStart("VIS002");

    await test.step("Verificar estilo del botón", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );

      const button = page.getByRole("button", { name: /Hacé click/i }).first();
      await expect(button).toHaveScreenshot("dynamic-button.png");
    });

    Logger.testEnd("VIS002", "PASSED");
  });

  test("VIS003 - Popup se visualiza correctamente", async ({ page }) => {
    Logger.testStart("VIS003");

    await test.step("Capturar popup abierto", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );

      await page.getByRole("button", { name: /Mostrar popup/i }).click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot("popup-open.png", {
        maxDiffPixels: 300,
        maxDiffPixelRatio: 0.02,
      });
    });

    Logger.testEnd("VIS003", "PASSED");
  });

  test("VIS004 - Responsive mobile", async ({ page }) => {
    Logger.testStart("VIS004");

    await test.step("Verificar diseño móvil", async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );

      await expect(page).toHaveScreenshot("mobile-homepage.png");
    });

    Logger.testEnd("VIS004", "PASSED");
  });

  test("VIS005 - Responsive tablet", async ({ page }) => {
    Logger.testStart("VIS005");

    await test.step("Verificar diseño tablet", async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );

      await expect(page).toHaveScreenshot("tablet-homepage.png");
    });

    Logger.testEnd("VIS005", "PASSED");
  });
});
