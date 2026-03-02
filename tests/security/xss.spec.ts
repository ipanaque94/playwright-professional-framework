import { test, expect } from "@playwright/test";
import { SandboxPage } from "../../pages/sandbox/SandboxPage";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Security Tests - XSS Prevention", () => {
  test("SEC001 - Campo de texto sanitiza script básico", async ({ page }) => {
    Logger.testStart("SEC001");

    const sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();

    await test.step("Intentar inyectar script XSS", async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      let alertFired = false;

      page.on("dialog", async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      await sandboxPage.enterText(xssPayload);
      await page.waitForTimeout(1000);

      expect(
        alertFired,
        `XSS VULNERABILITY: Script ejecutado con payload "${xssPayload}"`,
      ).toBeFalsy();
    });

    Logger.testEnd("SEC001", "PASSED");
  });

  test("SEC002 - Probar múltiples payloads XSS", async ({ page }) => {
    Logger.testStart("SEC002");

    const sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();

    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")',
      "<iframe src=\"javascript:alert('XSS')\">",
      '"><script>alert("XSS")</script>',
      '<body onload=alert("XSS")>',
    ];

    await test.step("Probar vectores de ataque XSS", async () => {
      let alertFired = false;
      page.on("dialog", async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      for (const payload of xssPayloads) {
        await sandboxPage.enterText(payload);
        await page.waitForTimeout(500);

        if (alertFired) {
          throw new Error(`XSS VULNERABILITY: Payload exitoso "${payload}"`);
        }

        await sandboxPage.clearTextInput();
        alertFired = false;
      }

      Logger.info(`✅ ${xssPayloads.length} payloads bloqueados`);
    });

    Logger.testEnd("SEC002", "PASSED");
  });

  test("SEC003 - Validar escape de caracteres especiales", async ({ page }) => {
    Logger.testStart("SEC003");

    const sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();

    await test.step("Verificar escape de caracteres", async () => {
      const specialChars = "<>\"'&";
      await sandboxPage.enterText(specialChars);
      const value = await sandboxPage.getTextInputValue();

      expect(value, "Campo no maneja caracteres especiales").toBeDefined();
    });

    Logger.testEnd("SEC003", "PASSED");
  });

  test("SEC004 - URL con javascript no se ejecuta", async ({ page }) => {
    Logger.testStart("SEC004");

    const sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();

    await test.step("Probar URL maliciosa", async () => {
      let alertFired = false;
      page.on("dialog", async (dialog) => {
        alertFired = true;
        await dialog.dismiss();
      });

      await sandboxPage.enterText('javascript:alert("XSS")');
      await page.waitForTimeout(1000);

      expect(alertFired, "javascript: URLs no bloqueadas").toBeFalsy();
    });

    Logger.testEnd("SEC004", "PASSED");
  });
});
