import { Page, Locator, expect } from "@playwright/test";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { Logger } from "../../utils/reporting/Logger";

//Componente reutilizable para Dropdowns
export class DropdownComponent {
  private page: Page;
  private elementHelper: ElementHelper;
  private waitHelper: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.elementHelper = new ElementHelper(page);
    this.waitHelper = new WaitHelper(page);
  }

  //Seleccionar opción por valor
  async selectByValue(dropdownLocator: Locator, value: string): Promise<void> {
    Logger.info(`Selecting dropdown option by value: ${value}`);
    await this.waitHelper.waitForElement(dropdownLocator);
    await dropdownLocator.selectOption(value);
  }

  //Seleccionar opción por texto visible
  async selectByLabel(dropdownLocator: Locator, label: string): Promise<void> {
    Logger.info(`Selecting dropdown option by label: ${label}`);
    await this.waitHelper.waitForElement(dropdownLocator);
    await dropdownLocator.selectOption({ label });
  }

  //Seleccionar opción por índice
  async selectByIndex(dropdownLocator: Locator, index: number): Promise<void> {
    Logger.info(`Selecting dropdown option by index: ${index}`);
    await this.waitHelper.waitForElement(dropdownLocator);
    await dropdownLocator.selectOption({ index });
  }

  //Obtener valor de opción seleccionada
  async getSelectedOption(dropdownLocator: Locator): Promise<string> {
    await this.waitHelper.waitForElement(dropdownLocator);
    return await dropdownLocator.inputValue();
  }

  //Obtener texto de opción seleccionada
  async getSelectedText(dropdownLocator: Locator): Promise<string> {
    await this.waitHelper.waitForElement(dropdownLocator);
    const value = await dropdownLocator.inputValue();
    const option = await dropdownLocator.locator(`option[value="${value}"]`);
    return (await option.textContent()) || "";
  }

  //Obtener todas las opciones del dropdown
  async getAllOptions(dropdownLocator: Locator): Promise<string[]> {
    await this.waitHelper.waitForElement(dropdownLocator);
    return await dropdownLocator.locator("option").allTextContents();
  }

  //Verificar si una opción existe
  async verifyOptionExists(
    dropdownLocator: Locator,
    optionText: string,
  ): Promise<boolean> {
    const options = await this.getAllOptions(dropdownLocator);
    return options.includes(optionText);
  }

  //Obtener cantidad de opciones
  async getOptionsCount(dropdownLocator: Locator): Promise<number> {
    await this.waitHelper.waitForElement(dropdownLocator);
    return await dropdownLocator.locator("option").count();
  }

  //Verificar que las opciones del dropdown coinciden con un listado esperado
  async verifyOptions(
    dropdownLocator: Locator,
    expectedOptions: string[],
  ): Promise<void> {
    const actualOptions = await this.getAllOptions(dropdownLocator);
    expect(actualOptions).toEqual(expectedOptions);
  }
}
