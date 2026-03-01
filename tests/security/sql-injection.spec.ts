import { test, expect } from "@playwright/test";
import { PayloadGenerator } from "../../utils/security/PayloadGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Security Tests - SQL Injection Prevention", () => {
  test("SEC005 - API rechaza SQL injection básico", async ({ request }) => {
    Logger.testStart("SEC005");

    const sqlPayload = "' OR '1'='1";

    const response = await request.get(
      `https://jsonplaceholder.typicode.com/posts?title=${encodeURIComponent(sqlPayload)}`,
    );

    // No debe causar error 500
    expect(response.status()).not.toBe(500);

    // Debe devolver respuesta válida
    expect([200, 400, 404]).toContain(response.status());

    Logger.testEnd("SEC005", "PASSED");
  });

  test("SEC006 - Probar múltiples payloads SQL", async ({ request }) => {
    Logger.testStart("SEC006");

    const payloads = PayloadGenerator.getSQLInjectionPayloads();

    for (const payload of payloads) {
      const response = await request.get(
        `https://jsonplaceholder.typicode.com/posts?search=${encodeURIComponent(payload)}`,
      );

      // No debe causar error interno
      expect(response.status()).not.toBe(500);
    }

    Logger.testEnd("SEC006", "PASSED");
  });

  test("SEC007 - API valida tipos de datos", async ({ request }) => {
    Logger.testStart("SEC007");

    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/INVALID_ID",
    );

    expect([400, 404]).toContain(response.status());

    Logger.testEnd("SEC007", "PASSED");
  });
});
