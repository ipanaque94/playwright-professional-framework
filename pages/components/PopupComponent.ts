import { Page, Locator, expect } from "@playwright/test";
import { PopupSelectors } from "./PopupSelectors";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class PopupComponent {
  private readonly showButton: Locator;
  private readonly closeButton: Locator;
  private readonly content: Locator;
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);

    this.showButton = page.getByRole(PopupSelectors.SHOW_BUTTON.role, {
      name: PopupSelectors.SHOW_BUTTON.name,
    });
    this.closeButton = page.getByRole(PopupSelectors.CLOSE_BUTTON.role, {
      name: PopupSelectors.CLOSE_BUTTON.name,
    });
    this.content = page.getByRole(PopupSelectors.CONTENT.role);
  }

  async open(): Promise<void> {
    Logger.info("Abriendo popup");
    await this.elementHelper.click(this.showButton);
    await this.waitHelper.waitForVisible(this.content);
    await this.waitHelper.waitForTimeout(500); // Animación
  }

  async close(): Promise<void> {
    Logger.info("Cerrando popup");
    await this.elementHelper.click(this.closeButton);
    await this.waitHelper.waitForHidden(this.content);
  }

  async closeByX(): Promise<void> {
    Logger.info("Cerrando popup con botón X");
    const closeButton = this.page.locator(
      '[aria-label="Close"], .close, .modal-close',
    );
    await this.elementHelper.click(closeButton);
    await this.waitHelper.waitForHidden(this.content);
  }

  async closeByClickingOutside(): Promise<void> {
    Logger.info("Cerrando popup clickeando fuera");
    const backdrop = this.page.locator(".modal-backdrop, .overlay");
    await this.elementHelper.click(backdrop);
    await this.waitHelper.waitForHidden(this.content);
  }

  async verifyVisible(text?: string): Promise<void> {
    if (text) {
      Logger.info(`Verificando popup con texto: ${text}`);
      await expect(this.page.getByText(text)).toBeVisible();
    } else {
      await expect(this.content).toBeVisible();
    }
  }

  async verifyNotVisible(): Promise<void> {
    Logger.info("Verificando que popup no está visible");
    await expect(this.content).not.toBeVisible();
  }

  async getText(): Promise<string> {
    await this.waitHelper.waitForVisible(this.content);
    return await this.elementHelper.getText(this.content);
  }

  async getTitle(): Promise<string> {
    const title = this.page.locator(
      '[role="dialog"] h1, [role="dialog"] h2, .modal-title, .popup-title',
    );
    await this.waitHelper.waitForVisible(title);
    return await this.elementHelper.getText(title);
  }

  async clickButton(buttonText: string): Promise<void> {
    Logger.info(`Clickeando botón en popup: ${buttonText}`);
    const button = this.content.getByRole("button", { name: buttonText });
    await this.elementHelper.click(button);
  }

  async isVisible(): Promise<boolean> {
    return await this.elementHelper.isVisible(this.content);
  }

  getContent(): Locator {
    return this.content;
  }
}
