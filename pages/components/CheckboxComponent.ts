import { Page } from "@playwright/test";
import { CheckboxSelectors } from "./CheckboxSelectors";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class CheckboxComponent {
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
  }

  async check(name: string): Promise<void> {
    Logger.info(`Marcando checkbox: "${name}"`);
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });

    await this.waitHelper.waitForVisible(checkbox);

    if (!(await checkbox.isChecked())) {
      await this.elementHelper.click(checkbox);
    }
  }

  async uncheck(name: string): Promise<void> {
    Logger.info(`Desmarcando checkbox: "${name}"`);
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });

    await this.waitHelper.waitForVisible(checkbox);

    if (await checkbox.isChecked()) {
      await this.elementHelper.click(checkbox);
    }
  }

  async toggle(name: string): Promise<void> {
    Logger.info(`Alternando checkbox: "${name}"`);
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });

    await this.waitHelper.waitForVisible(checkbox);
    await this.elementHelper.click(checkbox);
  }

  async isChecked(name: string): Promise<boolean> {
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });

    await this.waitHelper.waitForVisible(checkbox);
    return await checkbox.isChecked();
  }

  async checkMultiple(names: string[]): Promise<void> {
    Logger.info(`Marcando ${names.length} checkboxes`);
    for (const name of names) {
      await this.check(name);
    }
  }

  async uncheckMultiple(names: string[]): Promise<void> {
    Logger.info(`Desmarcando ${names.length} checkboxes`);
    for (const name of names) {
      await this.uncheck(name);
    }
  }

  async checkAll(): Promise<void> {
    Logger.info("Marcando todos los checkboxes");
    const checkboxes = this.page.getByRole(
      CheckboxSelectors.ALL_CHECKBOXES.role,
    );
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (!(await checkbox.isChecked())) {
        await this.elementHelper.click(checkbox);
      }
    }
  }

  async uncheckAll(): Promise<void> {
    Logger.info("Desmarcando todos los checkboxes");
    const checkboxes = this.page.getByRole(
      CheckboxSelectors.ALL_CHECKBOXES.role,
    );
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) {
        await this.elementHelper.click(checkbox);
      }
    }
  }

  async getCheckedItems(): Promise<string[]> {
    const checkboxes = this.page.getByRole(
      CheckboxSelectors.ALL_CHECKBOXES.role,
    );
    const count = await checkboxes.count();
    const checked: string[] = [];

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) {
        const label = await checkbox.getAttribute("aria-label");
        if (label) checked.push(label);
      }
    }

    Logger.info(`${checked.length} checkboxes marcados`);
    return checked;
  }

  async getUncheckedItems(): Promise<string[]> {
    const checkboxes = this.page.getByRole(
      CheckboxSelectors.ALL_CHECKBOXES.role,
    );
    const count = await checkboxes.count();
    const unchecked: string[] = [];

    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (!(await checkbox.isChecked())) {
        const label = await checkbox.getAttribute("aria-label");
        if (label) unchecked.push(label);
      }
    }

    return unchecked;
  }

  async getCount(): Promise<number> {
    const checkboxes = this.page.getByRole(
      CheckboxSelectors.ALL_CHECKBOXES.role,
    );
    return await checkboxes.count();
  }

  async isVisible(name: string): Promise<boolean> {
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });
    return await this.elementHelper.isVisible(checkbox);
  }

  async isEnabled(name: string): Promise<boolean> {
    const selector = CheckboxSelectors.checkbox(name);
    const checkbox = this.page.getByRole(selector.role, {
      name: selector.name,
    });
    return await checkbox.isEnabled();
  }
  // ... código existente ...

  async getCheckedLabels(labels: string[]): Promise<string[]> {
    Logger.info(`Verificando checkboxes marcados de: ${labels.join(", ")}`);
    const checked: string[] = [];

    for (const label of labels) {
      const isChecked = await this.isChecked(label);
      if (isChecked) {
        checked.push(label);
      }
    }

    Logger.info(`${checked.length} checkboxes marcados: ${checked.join(", ")}`);
    return checked;
  }
}
