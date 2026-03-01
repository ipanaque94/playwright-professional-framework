import { Page } from "@playwright/test";
import { Logger } from "../reporting/Logger";

/**
 * Helper para mediciones de performance
 */
export class PerformanceHelper {
  static async measurePageLoad(page: Page): Promise<number> {
    const startTime = Date.now();
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;
    Logger.info(`Page load time: ${loadTime}ms`);
    return loadTime;
  }

  static async getPerformanceMetrics(page: Page) {
    return await page.evaluate(() => {
      const perfData = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;

      return {
        domContentLoaded:
          perfData.domContentLoadedEventEnd -
          perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        responseTime: perfData.responseEnd - perfData.requestStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
        firstPaint:
          performance.getEntriesByName("first-paint")[0]?.startTime || 0,
        firstContentfulPaint:
          performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime || 0,
      };
    });
  }

  static async measureAPIResponseTime(
    fn: () => Promise<any>,
  ): Promise<{ result: any; time: number }> {
    const startTime = Date.now();
    const result = await fn();
    const time = Date.now() - startTime;
    Logger.info(`API response time: ${time}ms`);
    return { result, time };
  }

  static formatMetrics(metrics: any): string {
    return `
📊 Performance Metrics:
  ⏱️ DOM Content Loaded: ${metrics.domContentLoaded}ms
  ✅ Load Complete: ${metrics.loadComplete}ms
  🔄 Response Time: ${metrics.responseTime}ms
  🎨 First Paint: ${metrics.firstPaint}ms
  📄 First Contentful Paint: ${metrics.firstContentfulPaint}ms
    `;
  }
}
