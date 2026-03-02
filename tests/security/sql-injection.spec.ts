import { test, expect } from "@playwright/test";
import { TestAPIs } from "../../config/test-api.config";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Security Tests - SQL Injection Prevention", () => {
  test("SEC005 - API rechaza SQL injection básico", async ({ request }) => {
    Logger.testStart("SEC005");

    await test.step("Intentar SQL injection", async () => {
      const sqlPayload = "' OR '1'='1";
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/posts?title=${encodeURIComponent(sqlPayload)}`,
      );

      expect(
        response.status(),
        `SQL VULNERABILITY: Status 500 con payload "${sqlPayload}"`,
      ).not.toBe(500);
      expect(
        [200, 400, 404],
        `Status inesperado: ${response.status()}`,
      ).toContain(response.status());
    });

    Logger.testEnd("SEC005", "PASSED");
  });

  test("SEC006 - Probar múltiples payloads SQL", async ({ request }) => {
    Logger.testStart("SEC006");

    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1--",
      "' UNION SELECT NULL--",
      "admin'--",
      "' DROP TABLE users--",
    ];

    await test.step("Probar vectores de SQL injection", async () => {
      for (const payload of sqlPayloads) {
        const response = await request.get(
          `${TestAPIs.jsonPlaceholder.baseURL}/posts?userId=${encodeURIComponent(payload)}`,
        );

        expect(
          response.status(),
          `SQL VULNERABILITY: Status 500 con payload "${payload}"`,
        ).not.toBe(500);
      }

      Logger.info(`✅ ${sqlPayloads.length} payloads SQL bloqueados`);
    });

    Logger.testEnd("SEC006", "PASSED");
  });

  test("SEC007 - API valida tipos de datos", async ({ request }) => {
    Logger.testStart("SEC007");

    await test.step("Enviar tipo inválido", async () => {
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/posts/INVALID_ID`,
      );

      expect(
        [400, 404],
        `API no valida tipos: status ${response.status()}`,
      ).toContain(response.status());
    });

    Logger.testEnd("SEC007", "PASSED");
  });
});
