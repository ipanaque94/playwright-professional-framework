import { test, expect } from "@playwright/test";
import { PerformanceHelper } from "../../utils/performance/PerformanceHelper";
import { MetricsCollector } from "../../utils/performance/MetricsCollector";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Performance Tests - Load & Response Time", () => {
  const metricsCollector = new MetricsCollector();

  test("PERF001 - API soporta 50 requests concurrentes", async ({
    request,
  }) => {
    Logger.testStart("PERF001");

    const startTime = Date.now();

    const requests = Array.from({ length: 50 }, (_, i) =>
      request.get(`https://jsonplaceholder.typicode.com/posts/${i + 1}`),
    );

    const responses = await Promise.all(requests);
    const duration = Date.now() - startTime;

    // Validar que todas fueron exitosas
    responses.forEach((response) => {
      expect(response.ok()).toBeTruthy();
    });

    // Validar tiempo total
    console.log(`✅ 50 requests completadas en ${duration}ms`);
    expect(duration).toBeLessThan(10000); // Menos de 10 segundos

    // Calcular promedio
    const avgTime = duration / 50;
    console.log(`📊 Promedio por request: ${avgTime.toFixed(2)}ms`);

    metricsCollector.addMetric("concurrent_50_requests", duration);

    Logger.testEnd("PERF001", "PASSED");
  });

  test("PERF002 - Medir latencia promedio de API", async ({ request }) => {
    Logger.testStart("PERF002");

    const measurements: number[] = [];

    for (let i = 0; i < 10; i++) {
      const { time } = await PerformanceHelper.measureAPIResponseTime(
        async () => {
          return await request.get(
            "https://jsonplaceholder.typicode.com/posts/1",
          );
        },
      );

      measurements.push(time);
      metricsCollector.addMetric("api_latency", time);
    }

    const avg = measurements.reduce((a, b) => a + b) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    console.log(
      `📈 Latencia - Min: ${min}ms, Avg: ${avg.toFixed(2)}ms, Max: ${max}ms`,
    );

    expect(avg).toBeLessThan(500); // Promedio menor a 500ms

    Logger.testEnd("PERF002", "PASSED");
  });

  test("PERF003 - Página carga en tiempo aceptable", async ({ page }) => {
    Logger.testStart("PERF003");

    const loadTime = await PerformanceHelper.measurePageLoad(page);

    console.log(`🚀 Página cargada en ${loadTime}ms`);

    expect(loadTime).toBeLessThan(5000); // Menos de 5 segundos

    metricsCollector.addMetric("page_load", loadTime);

    Logger.testEnd("PERF003", "PASSED");
  });

  test("PERF004 - Performance metrics de navegador", async ({ page }) => {
    Logger.testStart("PERF004");

    await page.goto(
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    const metrics = await PerformanceHelper.getPerformanceMetrics(page);

    console.log(PerformanceHelper.formatMetrics(metrics));

    expect(metrics.domContentLoaded).toBeLessThan(2000);
    expect(metrics.responseTime).toBeLessThan(1000);

    Logger.testEnd("PERF004", "PASSED");
  });

  test.afterAll(async () => {
    const report = metricsCollector.generateReport();
    console.log(report);
    Logger.info("Performance Report", report);
  });
});
