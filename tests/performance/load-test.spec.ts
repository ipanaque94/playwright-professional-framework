import { test, expect } from "@playwright/test";
import { TestAPIs } from "../../config/test-api.config";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Performance Tests - Load & Response Time", () => {
  test("PERF001 - API soporta 50 requests concurrentes", async ({
    request,
  }) => {
    Logger.testStart("PERF001");

    await test.step("Ejecutar 50 peticiones concurrentes", async () => {
      const startTime = Date.now();

      const requests = Array.from({ length: 50 }, (_, i) =>
        request.get(`${TestAPIs.jsonPlaceholder.baseURL}/posts/${i + 1}`),
      );

      const responses = await Promise.all(requests);
      const duration = Date.now() - startTime;

      responses.forEach((response, index) => {
        expect(
          response.ok(),
          `Request ${index + 1} falló: status ${response.status()}`,
        ).toBeTruthy();
      });

      Logger.info(
        `✅ 50 requests en ${duration}ms (${(duration / 50).toFixed(2)}ms promedio)`,
      );
      expect(
        duration,
        `Tiempo excesivo: ${duration}ms (máximo 5000ms)`,
      ).toBeLessThan(5000);
    });

    Logger.testEnd("PERF001", "PASSED");
  });

  test("PERF002 - Medir latencia promedio de API", async ({ request }) => {
    Logger.testStart("PERF002");

    await test.step("Realizar 10 peticiones y medir latencia", async () => {
      const measurements: number[] = [];

      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        const response = await request.get(
          `${TestAPIs.jsonPlaceholder.baseURL}/posts/1`,
        );
        const latency = Date.now() - start;
        measurements.push(latency);

        expect(response.ok(), `Petición ${i + 1} falló`).toBeTruthy();
        Logger.info(`API response time: ${latency}ms`);
      }

      const avg = measurements.reduce((a, b) => a + b) / measurements.length;
      const min = Math.min(...measurements);
      const max = Math.max(...measurements);

      Logger.info(
        `📈 Latencia - Min: ${min}ms, Avg: ${avg.toFixed(2)}ms, Max: ${max}ms`,
      );
      expect(
        avg,
        `Latencia promedio alta: ${avg.toFixed(2)}ms (máximo 1000ms)`,
      ).toBeLessThan(1000);
    });

    Logger.testEnd("PERF002", "PASSED");
  });

  test("PERF003 - Página carga en tiempo aceptable", async ({ page }) => {
    Logger.testStart("PERF003");

    await test.step("Medir tiempo de carga de página", async () => {
      const startTime = Date.now();
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
        {
          waitUntil: "networkidle",
        },
      );
      const loadTime = Date.now() - startTime;

      Logger.info(`🚀 Página cargada en ${loadTime}ms`);
      expect(
        loadTime,
        `Carga lenta: ${loadTime}ms (máximo 3000ms)`,
      ).toBeLessThan(3000);
    });

    Logger.testEnd("PERF003", "PASSED");
  });

  test("PERF004 - Performance metrics de navegador", async ({ page }) => {
    Logger.testStart("PERF004");

    await test.step("Obtener métricas de navegador", async () => {
      await page.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );

      const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded:
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          responseTime: perfData.responseEnd - perfData.requestStart,
          firstPaint: performance.getEntriesByType("paint")[0]?.startTime || 0,
          firstContentfulPaint:
            performance.getEntriesByType("paint")[1]?.startTime || 0,
        };
      });

      Logger.info(
        `📊 Métricas - DOM: ${metrics.domContentLoaded}ms, Load: ${metrics.loadComplete}ms, Response: ${metrics.responseTime}ms`,
      );
      expect(
        metrics.responseTime,
        `Response time alto: ${metrics.responseTime}ms (máximo 500ms)`,
      ).toBeLessThan(500);
    });

    Logger.testEnd("PERF004", "PASSED");
  });
});
