import { Page, Locator } from "@playwright/test";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

// Componente profesional para formularios
export class FormComponent {
  private page: Page;
  private elementHelper: ElementHelper;

  constructor(page: Page) {
    this.page = page;
    this.elementHelper = new ElementHelper(page);
  }

  // Llenar campo de texto por locator
  async fillTextField(locator: Locator, value: string): Promise<void> {
    await this.elementHelper.fill(locator, value);
  }

  // Llenar campo de texto por placeholder
  async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
    const input = this.page.getByPlaceholder(placeholder);
    await this.elementHelper.fill(input, value);
  }

  // Llenar campo de texto por label
  async fillByLabel(label: string, value: string): Promise<void> {
    const input = this.page.getByLabel(label);
    await this.elementHelper.fill(input, value);
  }

  // Limpiar campo de texto
  async clearField(locator: Locator): Promise<void> {
    await this.elementHelper.clear(locator);
  }

  // Enviar formulario
  async submit(): Promise<void> {
    Logger.info("Submitting form");
    const submitButton = this.page.locator(
      'button[type="submit"], input[type="submit"]',
    );
    await this.elementHelper.click(submitButton);
  }

  // Enviar formulario presionando Enter en un campo específico
  async submitByEnter(locator: Locator): Promise<void> {
    Logger.info("Submitting form via Enter key");
    await locator.press("Enter");
  }

  // Llenar formulario completo a partir de un objeto de datos
  async fillForm(formData: Record<string, string>): Promise<void> {
    Logger.info("Filling complete form", formData);

    for (const [field, value] of Object.entries(formData)) {
      const input = this.page.locator(`[name="${field}"], #${field}`);
      await this.elementHelper.fill(input, value);
    }
  }

  // Obtener mensaje de error asociado a un campo
  async getFieldError(fieldName: string): Promise<string> {
    const error = this.page.locator(
      `[name="${fieldName}"] ~ .error, #${fieldName}-error`,
    );
    return (await error.textContent()) || "";
  }

  // Verificar si el formulario tiene errores visibles
  async hasErrors(): Promise<boolean> {
    const errors = await this.page.locator(".error, .invalid-feedback").count();
    return errors > 0;
  }
}
