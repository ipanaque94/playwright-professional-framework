import { Page, Locator, expect } from "@playwright/test";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

// Componente reutilizable para Checkboxes

export class CheckboxComponent {
  private page: Page;
  private elementHelper: ElementHelper;

  constructor(page: Page) {
    this.page = page;
    this.elementHelper = new ElementHelper(page);
  }

  //Obtener checkbox por label

  getCheckbox(label: string): Locator {
    return this.page.getByLabel(label);
  }

  //Marcar checkbox

  async check(label: string): Promise<void> {
    Logger.info(`Checking checkbox: ${label}`);
    const checkbox = this.getCheckbox(label);
    await this.elementHelper.checkElement(checkbox);
  }

  // Desmarcar checkbox

  async uncheck(label: string): Promise<void> {
    Logger.info(`Unchecking checkbox: ${label}`);
    const checkbox = this.getCheckbox(label);
    await this.elementHelper.uncheckElement(checkbox);
  }

  //Verificar si está marcado

  async isChecked(label: string): Promise<boolean> {
    const checkbox = this.getCheckbox(label);
    return await checkbox.isChecked();
  }

  //Toggle checkbox

  async toggle(label: string): Promise<void> {
    const isChecked = await this.isChecked(label);
    if (isChecked) {
      await this.uncheck(label);
    } else {
      await this.check(label);
    }
  }

  //Marcar múltiples checkboxes

  async checkMultiple(labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.check(label);
    }
  }

  //Desmarcar todos

  async uncheckAll(labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.uncheck(label);
    }
  }

  //Obtener todos los checkboxes marcados

  async getCheckedLabels(labels: string[]): Promise<string[]> {
    const checked: string[] = [];

    for (const label of labels) {
      if (await this.isChecked(label)) {
        checked.push(label);
      }
    }

    return checked;
  }
}
