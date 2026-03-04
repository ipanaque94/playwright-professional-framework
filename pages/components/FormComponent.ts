import { Page, Locator } from "@playwright/test";
import { FormSelectors } from "./FormSelectors";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class FormComponent {
  private readonly textInput: Locator;
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);

    this.textInput = page.getByPlaceholder(
      FormSelectors.TEXT_INPUT.placeholder,
    );
  }

  async fill(text: string): Promise<void> {
    Logger.info(`Llenando input con: "${text}"`);
    await this.waitHelper.waitForVisible(this.textInput);
    await this.elementHelper.fill(this.textInput, text);
  }

  async clear(): Promise<void> {
    Logger.info("Limpiando input");
    await this.elementHelper.clear(this.textInput);
  }

  async getValue(): Promise<string> {
    return await this.elementHelper.getValue(this.textInput);
  }

  getInput(): Locator {
    return this.textInput;
  }
}
