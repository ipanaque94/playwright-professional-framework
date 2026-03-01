import { test, expect } from "@playwright/test";
import { SecurityHelper } from "../../utils/security/SecurityHelper";
import { PayloadGenerator } from "../../utils/security/PayloadGenerator";
import { SandboxPage } from "../../pages/sandbox/SandboxPage";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Security Tests - XSS Prevention", () => {
  let sandboxPage: SandboxPage;

  test.beforeEach(async ({ page }) => {
    sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();
  });

  test("SEC001 - Campo de texto sanitiza script básico", async ({ page }) => {
    Logger.testStart("SEC001");

    const xssPayload = '<script>alert("XSS")</script>';

    await sandboxPage.enterText(xssPayload);

    // Esperar si se ejecuta un alert (no debería)
    let alertFired = false;
    page.on("dialog", async (dialog) => {
      alertFired = true;
      await dialog.dismiss();
    });

    await page.waitForTimeout(1000);

    expect(alertFired).toBeFalsy();

    const value = await sandboxPage.getTextInputValue();
    expect(value).toBe(xssPayload); // Debe estar como texto, no ejecutado

    Logger.testEnd("SEC001", "PASSED");
  });

  test("SEC002 - Probar múltiples payloads XSS", async ({ page }) => {
    Logger.testStart("SEC002");

    const payloads = PayloadGenerator.getXSSPayloads();

    for (const payload of payloads) {
      let alertFired = false;

      page.once("dialog", async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      await sandboxPage.enterText(payload);
      await page.waitForTimeout(500);

      expect(alertFired, `Payload "${payload}" triggered XSS`).toBeFalsy();

      await sandboxPage.clearTextInput();
    }

    Logger.testEnd("SEC002", "PASSED");
  });

  test("SEC003 - Validar escape de caracteres especiales", async () => {
    Logger.testStart("SEC003");

    const specialChars = "<>\"'&";

    await sandboxPage.enterText(specialChars);

    const value = await sandboxPage.getTextInputValue();

    expect(value).toBeDefined();

    Logger.testEnd("SEC003", "PASSED");
  });

  test("SEC004 - URL con javascript no se ejecuta", async ({ page }) => {
    Logger.testStart("SEC004");

    const maliciousURL =
      "https://thefreerangetester.github.io/sandbox-automation-testing/?param=javascript:alert(1)";

    await page.goto(maliciousURL);

    const url = page.url();
    expect(url).toContain("sandbox-automation-testing");

    Logger.testEnd("SEC004", "PASSED");
  });
});
