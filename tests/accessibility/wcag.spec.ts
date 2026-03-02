import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Accessibility Tests - WCAG Compliance", () => {
  test("A11Y001 - Sandbox cumple WCAG 2.1 AA", async ({ page }) => {
    Logger.testStart("A11Y001");

    await test.step("Ejecutar análisis de accesibilidad", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      Logger.info(
        `✅ Passed: ${results.passes.length}, ❌ Violations: ${results.violations.length}`,
      );

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      if (critical.length > 0) {
        const summary = critical
          .map((v) => `${v.id} (${v.nodes.length} elementos)`)
          .join(", ");
        throw new Error(
          `${critical.length} violaciones WCAG críticas: ${summary}`,
        );
      }

      expect(critical, "Violaciones WCAG críticas encontradas").toHaveLength(0);
    });

    Logger.testEnd("A11Y001", "PASSED");
  });

  test("A11Y002 - Imágenes tienen alt text", async ({ page }) => {
    Logger.testStart("A11Y002");

    await test.step("Verificar alt en imágenes", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );

      const imagesWithoutAlt = await page.locator("img:not([alt])").count();
      const totalImages = await page.locator("img").count();

      Logger.info(`📊 Imágenes: ${totalImages}, Sin alt: ${imagesWithoutAlt}`);
      expect(
        imagesWithoutAlt,
        `${imagesWithoutAlt} de ${totalImages} imágenes sin alt`,
      ).toBe(0);
    });

    Logger.testEnd("A11Y002", "PASSED");
  });

  test("A11Y003 - Navegación con teclado funciona", async ({ page }) => {
    Logger.testStart("A11Y003");

    await test.step("Verificar navegación Tab", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );

      await page.keyboard.press("Tab");
      const focused = await page.evaluate(
        () => document.activeElement?.tagName,
      );

      const interactiveElements = [
        "A",
        "BUTTON",
        "INPUT",
        "SELECT",
        "TEXTAREA",
      ];
      expect(
        interactiveElements,
        `Tab enfocó elemento no interactivo: ${focused}`,
      ).toContain(focused);
    });

    Logger.testEnd("A11Y003", "PASSED");
  });

  test("A11Y004 - Contraste de colores suficiente", async ({ page }) => {
    Logger.testStart("A11Y004");

    await test.step("Analizar contraste", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2aa"])
        .analyze();

      const contrastViolations = results.violations.filter(
        (v) => v.id.includes("contrast") || v.id.includes("color"),
      );

      expect(
        contrastViolations.length,
        `${contrastViolations.length} problemas de contraste`,
      ).toBe(0);
    });

    Logger.testEnd("A11Y004", "PASSED");
  });
});
