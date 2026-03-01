import { Page, Locator, expect } from "@playwright/test";
import { WaitHelper } from "./WaitHelper";

/**
 * Helper para interacciones con elementos
 */
export class ElementHelper {
  private page: Page;
  private waitHelper: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.waitHelper = new WaitHelper(page);
  }

  async click(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.click();
  }

  async doubleClick(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.dblclick();
  }

  async rightClick(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.click({ button: "right" });
  }

  async hover(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.hover();
  }

  async focus(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.focus();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await expect(locator).toBeEditable();
    await locator.fill(text);
  }

  async clear(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.clear();
  }

  async type(
    locator: Locator,
    text: string,
    delay: number = 100,
  ): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.pressSequentially(text, { delay });
  }

  async checkElement(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    if (!(await locator.isChecked())) {
      await locator.check();
    }
    await expect(locator).toBeChecked();
  }

  async uncheckElement(locator: Locator): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    if (await locator.isChecked()) {
      await locator.uncheck();
    }
    await expect(locator).not.toBeChecked();
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    await this.waitHelper.waitForElement(locator);
    return (await locator.textContent()) || "";
  }

  async getValue(locator: Locator): Promise<string> {
    await this.waitHelper.waitForElement(locator);
    return await locator.inputValue();
  }

  async getAttribute(
    locator: Locator,
    attribute: string,
  ): Promise<string | null> {
    await this.waitHelper.waitForElement(locator);
    return await locator.getAttribute(attribute);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async dragAndDrop(source: Locator, target: Locator): Promise<void> {
    await this.waitHelper.waitForElement(source);
    await this.waitHelper.waitForElement(target);
    await source.dragTo(target);
  }

  async pressKey(locator: Locator, key: string): Promise<void> {
    await this.waitHelper.waitForElement(locator);
    await locator.press(key);
  }
}
