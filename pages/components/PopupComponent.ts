import { Page, Locator, expect } from "@playwright/test";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

// Componente profesional para popups/modales
export class PopupComponent {
  private page: Page;
  private waitHelper: WaitHelper;
  private elementHelper: ElementHelper;

  constructor(page: Page) {
    this.page = page;
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
  }

  // Abrir popup mediante botón
  async open(buttonText: string = "Mostrar popup"): Promise<void> {
    Logger.info(`Opening popup via button: ${buttonText}`);
    const button = this.page.getByRole("button", { name: buttonText });
    await this.elementHelper.click(button);
    await this.waitHelper.waitForTimeout(500); // Animación
  }

  // Cerrar popup mediante botón dentro del mismo
  async close(buttonText: string = "Cerrar"): Promise<void> {
    Logger.info(`Closing popup via button: ${buttonText}`);
    const button = this.page.getByRole("button", { name: buttonText });
    await this.elementHelper.click(button);
  }

  // Cerrar popup mediante botón X
  async closeByX(): Promise<void> {
    Logger.info("Closing popup via X button");
    const closeButton = this.page.locator(
      '[aria-label="Close"], .close, .modal-close',
    );
    await this.elementHelper.click(closeButton);
  }

  // Cerrar popup haciendo click fuera del mismo
  async closeByClickingOutside(): Promise<void> {
    Logger.info("Closing popup by clicking outside");
    const backdrop = this.page.locator(".modal-backdrop, .overlay");
    await this.elementHelper.click(backdrop);
  }

  // Verificar que popup está visible, opcionalmente con texto específico
  async verifyPopupVisible(popupText?: string): Promise<void> {
    if (popupText) {
      Logger.info(`Verifying popup with text: ${popupText}`);
      const popup = this.page.getByText(popupText);
      await expect(popup).toBeVisible();
    } else {
      const modal = this.page.locator('.modal, .popup, [role="dialog"]');
      await expect(modal).toBeVisible();
    }
  }

  // Verificar que popup no está visible
  async verifyPopupNotVisible(): Promise<void> {
    Logger.info("Verifying popup is not visible");
    const modal = this.page.locator('.modal, .popup, [role="dialog"]');
    await expect(modal).not.toBeVisible();
  }

  // Obtener texto del popup
  async getPopupText(): Promise<string> {
    const popup = this.page
      .locator('.modal-body, .popup-content, [role="dialog"]')
      .first();
    await this.waitHelper.waitForElement(popup);
    return (await popup.textContent()) || "";
  }

  // Obtener título del popup
  async getPopupTitle(): Promise<string> {
    const title = this.page.locator(
      '.modal-title, .popup-title, [role="dialog"] h1, [role="dialog"] h2',
    );
    await this.waitHelper.waitForElement(title);
    return (await title.textContent()) || "";
  }

  // Hacer click en botón dentro del popup
  async clickButtonInPopup(buttonText: string): Promise<void> {
    Logger.info(`Clicking button in popup: ${buttonText}`);
    const button = this.page
      .locator('[role="dialog"]')
      .getByRole("button", { name: buttonText });
    await this.elementHelper.click(button);
  }
}
