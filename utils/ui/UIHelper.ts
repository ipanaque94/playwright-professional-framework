import { Page } from "@playwright/test";
import { Logger } from "../reporting/Logger";

/**
 * Helper para operaciones generales de UI
 */
export class UIHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollBy(x: number, y: number): Promise<void> {
    await this.page.evaluate(({ x, y }) => window.scrollBy(x, y), { x, y });
  }

  async getWindowSize() {
    return await this.page.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));
  }

  async setWindowSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  async acceptAlert(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.accept());
  }

  async dismissAlert(): Promise<void> {
    this.page.once("dialog", (dialog) => dialog.dismiss());
  }

  async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", (dialog) => {
        const text = dialog.message();
        dialog.accept();
        resolve(text);
      });
    });
  }

  async executeScript(script: string): Promise<any> {
    return await this.page.evaluate(script);
  }

  async getCookies() {
    return await this.page.context().cookies();
  }

  async addCookie(name: string, value: string): Promise<void> {
    await this.page
      .context()
      .addCookies([{ name, value, url: this.page.url() }]);
  }

  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  async takeScreenshot(name: string, fullPage: boolean = true): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage,
    });
  }

  async switchToNewTab() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    return newPage;
  }

  async refresh(): Promise<void> {
    await this.page.reload();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
