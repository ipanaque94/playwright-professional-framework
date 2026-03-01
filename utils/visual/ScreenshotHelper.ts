import { Page, Locator } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * Helper para screenshots
 */
export class ScreenshotHelper {
  private static screenshotDir = "screenshots";

  static init(): void {
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  static async takeFullPageScreenshot(
    page: Page,
    name: string,
  ): Promise<string> {
    this.init();
    const filepath = path.join(this.screenshotDir, `${name}-${Date.now()}.png`);

    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    return filepath;
  }

  static async takeElementScreenshot(
    locator: Locator,
    name: string,
  ): Promise<string> {
    this.init();
    const filepath = path.join(this.screenshotDir, `${name}-${Date.now()}.png`);

    await locator.screenshot({ path: filepath });

    return filepath;
  }

  static async takeViewportScreenshot(
    page: Page,
    name: string,
  ): Promise<string> {
    this.init();
    const filepath = path.join(this.screenshotDir, `${name}-${Date.now()}.png`);

    await page.screenshot({ path: filepath });

    return filepath;
  }

  static async compareScreenshots(
    baseline: string,
    current: string,
  ): Promise<boolean> {
    // Esta es una versión simplificada
    // En producción usarías una librería como pixelmatch
    const baselineExists = fs.existsSync(baseline);
    const currentExists = fs.existsSync(current);

    return baselineExists && currentExists;
  }
}
