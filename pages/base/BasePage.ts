import { Page, Locator, expect } from "@playwright/test";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { UIHelper } from "../../utils/ui/UIHelper";
import { Logger } from "../../utils/reporting/Logger";

//Clase base para todas las páginas
//Implementa el patrón Page Object Model

export abstract class BasePage {
  protected page: Page;
  protected waitHelper: WaitHelper;
  protected elementHelper: ElementHelper;
  protected uiHelper: UIHelper;

  constructor(page: Page) {
    this.page = page;
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
    this.uiHelper = new UIHelper(page);
  }

  //URL de la página (debe ser implementado por cada página)

  abstract getURL(): string;

  // Navegar a la página

  async goto(url?: string): Promise<void> {
    const targetURL = url || this.getURL();
    Logger.info(`Navigating to: ${targetURL}`);

    await this.page.goto(targetURL);
    await this.waitForPageLoad();

    Logger.info(`Successfully navigated to: ${targetURL}`);
  }

  //Esperar a que la página cargue completamente

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
  }

  // Obtener título de la página

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  //Obtener URL actual

  getCurrentURL(): string {
    return this.page.url();
  }

  // Recargar página

  async reload(): Promise<void> {
    Logger.info("Reloading page");
    await this.page.reload();
    await this.waitForPageLoad();
  }

  //Navegar atrás

  async goBack(): Promise<void> {
    Logger.info("Navigating back");
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  //Navegar adelante

  async goForward(): Promise<void> {
    Logger.info("Navigating forward");
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  //Click en elemento con espera automática

  async clickElement(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Clicking: ${description}`);
    await this.elementHelper.click(locator);
  }

  //Llenar input con validación

  async fillInput(
    locator: Locator,
    text: string,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Filling ${description}: ${text}`);
    await this.elementHelper.fill(locator, text);
    await expect(locator).toHaveValue(text);
  }

  //verificar que elemento es visible

  async verifyElementVisible(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is visible`);
    await this.waitHelper.waitForElement(locator);
    await expect(locator).toBeVisible();
  }

  //Verificar que elemento no es visible

  async verifyElementNotVisible(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is not visible`);
    await expect(locator).not.toBeVisible();
  }

  //Scroll al elemento

  async scrollToElement(locator: Locator): Promise<void> {
    await this.elementHelper.scrollIntoView(locator);
  }

  //Tomar screenshot

  async takeScreenshot(name: string): Promise<void> {
    await this.uiHelper.takeScreenshot(name);
    Logger.info(`Screenshot saved: ${name}`);
  }

  //Esperar por tiempo específico (usar solo cuando sea necesario)

  async wait(ms: number): Promise<void> {
    await this.waitHelper.waitForTimeout(ms);
  }
}
