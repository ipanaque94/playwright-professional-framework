import { test, expect } from "@playwright/test";
import { AccessibilityHelper } from "../../utils/accessibility/AccessibilityHelper";
import { A11yReporter } from "../../utils/accessibility/A11yReporter";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Accessibility Tests - WCAG Compliance", () => {
  test("A11Y001 - Sandbox cumple WCAG 2.1 AA", async ({ page }) => {
    Logger.testStart("A11Y001");

    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    const results = await AccessibilityHelper.runWCAGScan(page);

    console.log(`✅ Tests passed: ${results.passes.length}`);
    console.log(`❌ Violations: ${results.violations.length}`);

    if (results.violations.length > 0) {
      console.log(A11yReporter.generateReport(results));
    }

    const criticalViolations = A11yReporter.getCriticalViolations(results);

    expect(criticalViolations).toHaveLength(0);

    Logger.testEnd("A11Y001", "PASSED");
  });

  test("A11Y002 - Imágenes tienen alt text", async ({ page }) => {
    Logger.testStart("A11Y002");

    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    const { total, missing } =
      await AccessibilityHelper.checkImageAltText(page);

    console.log(`📊 Total images: ${total}, Missing alt: ${missing}`);

    expect(missing).toBeLessThanOrEqual(total * 0.1); // Max 10% sin alt

    Logger.testEnd("A11Y002", "PASSED");
  });

  test("A11Y003 - Navegación con teclado funciona", async ({ page }) => {
    Logger.testStart("A11Y003");

    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    const canNavigate = await AccessibilityHelper.checkKeyboardNavigation(page);

    expect(canNavigate).toBeTruthy();

    Logger.testEnd("A11Y003", "PASSED");
  });

  test("A11Y004 - Contraste de colores es suficiente", async ({ page }) => {
    Logger.testStart("A11Y004");

    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    const contrastViolations =
      await AccessibilityHelper.checkColorContrast(page);

    expect(contrastViolations).toHaveLength(0);

    Logger.testEnd("A11Y004", "PASSED");
  });
});
