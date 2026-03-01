import { Page, Locator } from "@playwright/test";
import { Logger } from "../../utils/reporting/Logger";

// Componente reutilizable para Radio Buttons
export class RadioButtonComponent {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Seleccionar radio button por nombre
  async select(name: string): Promise<void> {
    Logger.info(`Selecting radio button: ${name}`);

    const radio = this.page.getByRole("radio", { name });
    await radio.click();
  }

  // Verificar si un radio button está seleccionado
  async isSelected(name: string): Promise<boolean> {
    const radio = this.page.getByRole("radio", { name });
    return await radio.isChecked();
  }

  // Obtener valor del radio button seleccionado, opcionalmente por grupo
  async getSelectedOption(groupName?: string): Promise<string | null> {
    const selector = groupName
      ? `input[type="radio"][name="${groupName}"]:checked`
      : 'input[type="radio"]:checked';

    const checkedRadio = this.page.locator(selector).first();

    if ((await checkedRadio.count()) === 0) {
      return null;
    }

    return await checkedRadio.getAttribute("value");
  }
}
