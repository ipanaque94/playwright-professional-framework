import { Page, Browser, BrowserContext } from "@playwright/test";

/**
 * Helper para operaciones de navegador
 */
export class BrowserHelper {
  static async createNewContext(
    browser: Browser,
    options?: any,
  ): Promise<BrowserContext> {
    return await browser.newContext(options);
  }

  static async createNewPage(context: BrowserContext): Promise<Page> {
    return await context.newPage();
  }

  static async closeContext(context: BrowserContext): Promise<void> {
    await context.close();
  }

  static async clearBrowserData(context: BrowserContext): Promise<void> {
    await context.clearCookies();
    await context.clearPermissions();
  }

  static async setGeolocation(
    context: BrowserContext,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    await context.setGeolocation({ latitude, longitude });
  }

  static async grantPermissions(
    context: BrowserContext,
    permissions: string[],
  ): Promise<void> {
    await context.grantPermissions(permissions);
  }
}
