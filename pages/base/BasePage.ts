import { Page, Locator, expect } from "@playwright/test";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { UIHelper } from "../../utils/ui/UIHelper";
import { Logger } from "../../utils/reporting/Logger";

/**
 * Clase base para todas las páginas
 * Implementa el patrón Page Object Model (POM)
 */
export abstract class BasePage {
  protected page: Page;
  protected waitHelper: WaitHelper;
  protected elementHelper: ElementHelper;
  protected uiHelper: UIHelper;
  private url?: string;

  constructor(page: Page, url?: string) {
    this.page = page;
    this.url = url;
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
    this.uiHelper = new UIHelper(page);
  }

  /**
   * Navegar a la URL de la página
   */
  async goto(): Promise<void> {
    const pageUrl = this.url || this.getURL();
    Logger.info(`Navigating to: ${pageUrl}`);
    await this.page.goto(pageUrl);
    Logger.info(`Successfully navigated to: ${pageUrl}`);
  }

  /**
   * Método abstracto que debe ser implementado por cada página
   * Retorna la URL de la página
   */
  abstract getURL(): string;

  /**
   * Esperar a que la página cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Obtener título de la página
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Obtener URL actual
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Recargar página
   */
  async reload(): Promise<void> {
    Logger.info("Reloading page");
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Navegar atrás
   */
  async goBack(): Promise<void> {
    Logger.info("Navigating back");
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Navegar adelante
   */
  async goForward(): Promise<void> {
    Logger.info("Navigating forward");
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Click en elemento con espera automática
   */
  async clickElement(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Clicking: ${description}`);
    await this.elementHelper.click(locator);
  }

  /**
   * Llenar input con validación
   */
  async fillInput(
    locator: Locator,
    text: string,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Filling ${description}: ${text}`);
    await this.elementHelper.fill(locator, text);
    await expect(locator).toHaveValue(text);
  }

  /**
   * Verificar que elemento es visible
   */
  async verifyElementVisible(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is visible`);
    await this.waitHelper.waitForVisible(locator);
    await expect(locator).toBeVisible();
  }

  /**
   * Verificar que elemento no es visible
   */
  async verifyElementNotVisible(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is not visible`);
    await expect(locator).not.toBeVisible();
  }

  /**
   * Verificar texto de elemento
   */
  async verifyElementText(
    locator: Locator,
    expectedText: string,
    description?: string,
  ): Promise<void> {
    if (description)
      Logger.info(`Verifying ${description} has text: ${expectedText}`);
    await expect(locator).toHaveText(expectedText);
  }

  /**
   * Verificar que elemento contiene texto
   */
  async verifyElementContainsText(
    locator: Locator,
    text: string,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} contains: ${text}`);
    await expect(locator).toContainText(text);
  }

  /**
   * Verificar que elemento está habilitado
   */
  async verifyElementEnabled(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is enabled`);
    await expect(locator).toBeEnabled();
  }

  /**
   * Verificar que elemento está deshabilitado
   */
  async verifyElementDisabled(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is disabled`);
    await expect(locator).toBeDisabled();
  }

  /**
   * Scroll al elemento
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await this.elementHelper.scrollIntoView(locator);
  }

  /**
   * Scroll a la parte superior de la página
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    Logger.info("Scrolled to top");
  }

  /**
   * Scroll a la parte inferior de la página
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
    Logger.info("Scrolled to bottom");
  }

  /**
   * Hover sobre elemento
   */
  async hoverElement(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Hovering: ${description}`);
    await this.elementHelper.hover(locator);
  }

  /**
   * Double click en elemento
   */
  async doubleClickElement(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Double clicking: ${description}`);
    await locator.dblclick();
  }

  /**
   * Right click en elemento
   */
  async rightClickElement(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Right clicking: ${description}`);
    await locator.click({ button: "right" });
  }

  /**
   * Presionar tecla
   */
  async pressKey(key: string): Promise<void> {
    Logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Escribir texto con teclado
   */
  async typeText(text: string): Promise<void> {
    Logger.info(`Typing: ${text}`);
    await this.page.keyboard.type(text);
  }

  /**
   * Limpiar input
   */
  async clearInput(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Clearing: ${description}`);
    await this.elementHelper.clear(locator);
  }

  /**
   * Obtener texto de elemento
   */
  async getElementText(locator: Locator): Promise<string> {
    return await this.elementHelper.getText(locator);
  }

  /**
   * Obtener valor de input
   */
  async getInputValue(locator: Locator): Promise<string> {
    return await this.elementHelper.getValue(locator);
  }

  /**
   * Verificar que elemento existe en el DOM
   */
  async verifyElementExists(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} exists`);
    await expect(locator).toBeAttached();
  }

  /**
   * Contar elementos
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Verificar conteo de elementos
   */
  async verifyElementCount(
    locator: Locator,
    expectedCount: number,
    description?: string,
  ): Promise<void> {
    if (description)
      Logger.info(`Verifying ${description} count is ${expectedCount}`);
    await expect(locator).toHaveCount(expectedCount);
  }

  /**
   * Esperar elemento visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await this.waitHelper.waitForVisible(locator, timeout);
  }

  /**
   * Esperar elemento oculto
   */
  async waitForElementHidden(
    locator: Locator,
    timeout?: number,
  ): Promise<void> {
    await this.waitHelper.waitForHidden(locator, timeout);
  }

  /**
   * Tomar screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.uiHelper.takeScreenshot(name);
    Logger.info(`Screenshot saved: ${name}`);
  }

  /**
   * Tomar screenshot de página completa
   */
  async takeFullPageScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
    Logger.info(`Full page screenshot saved: ${name}`);
  }

  /**
   * Tomar screenshot de elemento
   */
  async takeElementScreenshot(locator: Locator, name: string): Promise<void> {
    await locator.screenshot({ path: `screenshots/${name}.png` });
    Logger.info(`Element screenshot saved: ${name}`);
  }

  /**
   * Esperar por tiempo específico (usar solo cuando sea necesario)
   */
  async wait(ms: number): Promise<void> {
    await this.waitHelper.waitForTimeout(ms);
  }

  /**
   * Ejecutar JavaScript en la página
   */
  async executeScript<T>(script: string): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Obtener atributo de elemento
   */
  async getElementAttribute(
    locator: Locator,
    attribute: string,
  ): Promise<string | null> {
    return await locator.getAttribute(attribute);
  }

  /**
   * Verificar atributo de elemento
   */
  async verifyElementAttribute(
    locator: Locator,
    attribute: string,
    expectedValue: string,
    description?: string,
  ): Promise<void> {
    if (description)
      Logger.info(
        `Verifying ${description} has ${attribute}: ${expectedValue}`,
      );
    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  /**
   * Verificar URL actual
   */
  async verifyCurrentURL(expectedURL: string): Promise<void> {
    Logger.info(`Verifying URL is: ${expectedURL}`);
    expect(this.getCurrentURL()).toBe(expectedURL);
  }

  /**
   * Verificar que URL contiene texto
   */
  async verifyURLContains(text: string): Promise<void> {
    Logger.info(`Verifying URL contains: ${text}`);
    expect(this.getCurrentURL()).toContain(text);
  }

  /**
   * Verificar título de página
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    Logger.info(`Verifying page title is: ${expectedTitle}`);
    const title = await this.getTitle();
    expect(title).toBe(expectedTitle);
  }

  /**
   * Verificar que título contiene texto
   */
  async verifyPageTitleContains(text: string): Promise<void> {
    Logger.info(`Verifying page title contains: ${text}`);
    const title = await this.getTitle();
    expect(title).toContain(text);
  }

  /**
   * Verificar checkbox está marcado
   */
  async verifyCheckboxChecked(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is checked`);
    await expect(locator).toBeChecked();
  }

  /**
   * Verificar checkbox NO está marcado
   */
  async verifyCheckboxUnchecked(
    locator: Locator,
    description?: string,
  ): Promise<void> {
    if (description) Logger.info(`Verifying ${description} is unchecked`);
    await expect(locator).not.toBeChecked();
  }

  /**
   * Aceptar alerta/confirmación
   */
  async acceptDialog(): Promise<void> {
    this.page.once("dialog", async (dialog) => {
      Logger.info(`Accepting dialog: ${dialog.message()}`);
      await dialog.accept();
    });
  }

  /**
   * Rechazar alerta/confirmación
   */
  async dismissDialog(): Promise<void> {
    this.page.once("dialog", async (dialog) => {
      Logger.info(`Dismissing dialog: ${dialog.message()}`);
      await dialog.dismiss();
    });
  }

  /**
   * Obtener mensaje de alerta
   */
  async getDialogMessage(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        Logger.info(`Dialog message: ${message}`);
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Cambiar a nueva pestaña
   */
  async switchToNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
    ]);
    await newPage.waitForLoadState();
    Logger.info("Switched to new tab");
    return newPage;
  }

  /**
   * Cerrar pestaña actual
   */
  async closeCurrentTab(): Promise<void> {
    Logger.info("Closing current tab");
    await this.page.close();
  }

  /**
   * Cambiar viewport
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    Logger.info(`Setting viewport to: ${width}x${height}`);
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Simular modo móvil
   */
  async setMobileViewport(): Promise<void> {
    await this.setViewportSize(375, 667); // iPhone SE
    Logger.info("Mobile viewport set");
  }

  /**
   * Simular modo tablet
   */
  async setTabletViewport(): Promise<void> {
    await this.setViewportSize(768, 1024); // iPad
    Logger.info("Tablet viewport set");
  }

  /**
   * Simular modo desktop
   */
  async setDesktopViewport(): Promise<void> {
    await this.setViewportSize(1920, 1080); // Full HD
    Logger.info("Desktop viewport set");
  }

  /**
   * Obtener cookies
   */
  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  /**
   * Agregar cookie
   */
  async addCookie(name: string, value: string, domain?: string): Promise<void> {
    await this.page.context().addCookies([
      {
        name,
        value,
        domain: domain || new URL(this.getCurrentURL()).hostname,
        path: "/",
      },
    ]);
    Logger.info(`Cookie added: ${name}`);
  }

  /**
   * Limpiar cookies
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
    Logger.info("Cookies cleared");
  }

  /**
   * Drag and drop
   */
  async dragAndDrop(source: Locator, target: Locator): Promise<void> {
    Logger.info("Performing drag and drop");
    await source.dragTo(target);
  }

  /**
   * Verificar que elemento tiene clase CSS
   */
  async verifyElementHasClass(
    locator: Locator,
    className: string,
    description?: string,
  ): Promise<void> {
    if (description)
      Logger.info(`Verifying ${description} has class: ${className}`);
    await expect(locator).toHaveClass(new RegExp(className));
  }

  /**
   * Seleccionar archivo para upload
   */
  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    Logger.info(`Uploading file: ${filePath}`);
    await locator.setInputFiles(filePath);
  }

  /**
   * Seleccionar múltiples archivos
   */
  async uploadMultipleFiles(
    locator: Locator,
    filePaths: string[],
  ): Promise<void> {
    Logger.info(`Uploading ${filePaths.length} files`);
    await locator.setInputFiles(filePaths);
  }

  /**
   * Focus en elemento
   */
  async focusElement(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Focusing: ${description}`);
    await locator.focus();
  }

  /**
   * Blur (quitar focus) de elemento
   */
  async blurElement(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Blurring: ${description}`);
    await locator.blur();
  }
}
