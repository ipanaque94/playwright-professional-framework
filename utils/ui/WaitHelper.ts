import { Page, Locator } from "@playwright/test";

/**
 * Helper para esperas
 */
export class WaitHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForElement(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  async waitForElementHidden(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  async waitForElementAttached(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await locator.waitFor({ state: "attached", timeout });
  }

  async waitForElementDetached(
    locator: Locator,
    timeout: number = 10000,
  ): Promise<void> {
    await locator.waitFor({ state: "detached", timeout });
  }

  async waitForText(text: string, timeout: number = 10000): Promise<void> {
    await this.page.getByText(text).waitFor({ state: "visible", timeout });
  }

  async waitForURL(
    url: string | RegExp,
    timeout: number = 10000,
  ): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  async waitForAPIResponse(
    urlPattern: string | RegExp,
    timeout: number = 30000,
  ) {
    return await this.page.waitForResponse(urlPattern, { timeout });
  }

  async waitForAPIRequest(
    urlPattern: string | RegExp,
    timeout: number = 30000,
  ) {
    return await this.page.waitForRequest(urlPattern, { timeout });
  }

  async waitForSelector(
    selector: string,
    timeout: number = 10000,
  ): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForFunction(
    fn: () => boolean | Promise<boolean>,
    timeout: number = 10000,
  ): Promise<void> {
    await this.page.waitForFunction(fn, {}, { timeout });
  }
}
