import { Page } from "@playwright/test";
import { RadioButtonSelectors } from "./RadioButtonSelectors";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class RadioButtonComponent {
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
  }

  async selectYes(): Promise<void> {
    Logger.info("Seleccionando radio: SI");
    const radio = this.page.getByRole(RadioButtonSelectors.YES.role, {
      name: RadioButtonSelectors.YES.name,
    });

    await this.waitHelper.waitForVisible(radio);
    await this.elementHelper.click(radio);
  }

  async selectNo(): Promise<void> {
    Logger.info("Seleccionando radio: NO");
    const radio = this.page.getByRole(RadioButtonSelectors.NO.role, {
      name: RadioButtonSelectors.NO.name,
    });

    await this.waitHelper.waitForVisible(radio);
    await this.elementHelper.click(radio);
  }

  async select(name: string): Promise<void> {
    Logger.info(`Seleccionando radio: "${name}"`);
    const selector = RadioButtonSelectors.radio(name);
    const radio = this.page.getByRole(selector.role, { name: selector.name });

    await this.waitHelper.waitForVisible(radio);
    await this.elementHelper.click(radio);
  }

  async isSelected(name: string): Promise<boolean> {
    const selector = RadioButtonSelectors.radio(name);
    const radio = this.page.getByRole(selector.role, { name: selector.name });

    await this.waitHelper.waitForVisible(radio);
    return await radio.isChecked();
  }

  async getSelectedValue(): Promise<string | null> {
    const radios = this.page.getByRole("radio");
    const count = await radios.count();

    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i);
      if (await radio.isChecked()) {
        return await radio.getAttribute("aria-label");
      }
    }

    return null;
  }

  async isVisible(name: string): Promise<boolean> {
    const selector = RadioButtonSelectors.radio(name);
    const radio = this.page.getByRole(selector.role, { name: selector.name });
    return await this.elementHelper.isVisible(radio);
  }

  async isEnabled(name: string): Promise<boolean> {
    const selector = RadioButtonSelectors.radio(name);
    const radio = this.page.getByRole(selector.role, { name: selector.name });
    return await radio.isEnabled();
  }
}
