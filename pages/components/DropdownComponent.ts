import { Locator, Page } from "@playwright/test";
import { DropdownSelectors } from "./DropdownSelectors";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class DropdownComponent {
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
  }

  async selectSport(sport: string): Promise<void> {
    Logger.info(`Seleccionando deporte: "${sport}"`);
    const dropdown = this.page.getByRole(DropdownSelectors.SPORT.role, {
      name: DropdownSelectors.SPORT.name,
    });

    await this.waitHelper.waitForVisible(dropdown);
    await this.elementHelper.click(dropdown);

    const option = DropdownSelectors.option(sport);
    const sportLink = this.page.getByRole(option.role, { name: option.name });

    await this.waitHelper.waitForVisible(sportLink);
    await this.elementHelper.click(sportLink);
  }

  async selectWeekday(day: string): Promise<void> {
    Logger.info(`Seleccionando día: "${day}"`);
    const dropdown = this.page.getByRole(DropdownSelectors.WEEKDAY.role, {
      name: DropdownSelectors.WEEKDAY.name,
    });

    await this.waitHelper.waitForVisible(dropdown);
    await this.elementHelper.click(dropdown);

    const option = DropdownSelectors.option(day);
    const dayLink = this.page.getByRole(option.role, { name: option.name });

    await this.waitHelper.waitForVisible(dayLink);
    await this.elementHelper.click(dayLink);
  }

  async openSportDropdown(): Promise<void> {
    Logger.info("Abriendo dropdown de deportes");
    const dropdown = this.page.getByRole(DropdownSelectors.SPORT.role, {
      name: DropdownSelectors.SPORT.name,
    });
    await this.elementHelper.click(dropdown);
  }

  async openWeekdayDropdown(): Promise<void> {
    Logger.info("Abriendo dropdown de días");
    const dropdown = this.page.getByRole(DropdownSelectors.WEEKDAY.role, {
      name: DropdownSelectors.WEEKDAY.name,
    });
    await this.elementHelper.click(dropdown);
  }

  async getSelectedSport(): Promise<string> {
    const dropdown = this.page.getByRole(DropdownSelectors.SPORT.role, {
      name: DropdownSelectors.SPORT.name,
    });
    return await this.elementHelper.getText(dropdown);
  }

  async getSelectedWeekday(): Promise<string> {
    const dropdown = this.page.getByRole(DropdownSelectors.WEEKDAY.role, {
      name: DropdownSelectors.WEEKDAY.name,
    });
    return await this.elementHelper.getText(dropdown);
  }

  async isDropdownOpen(dropdownName: "sport" | "weekday"): Promise<boolean> {
    const selector =
      dropdownName === "sport"
        ? DropdownSelectors.SPORT
        : DropdownSelectors.WEEKDAY;

    const dropdown = this.page.getByRole(selector.role, {
      name: selector.name,
    });
    const expanded = await dropdown.getAttribute("aria-expanded");
    return expanded === "true";
  }

  async getAvailableOptions(): Promise<string[]> {
    const options = this.page.getByRole("link");
    const count = await options.count();
    const optionsList: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.elementHelper.getText(options.nth(i));
      if (text) optionsList.push(text);
    }

    return optionsList;
  }

  async selectByValue(dropdown: Locator, value: string): Promise<void> {
    Logger.info(`Seleccionando opción: "${value}"`);
    await this.waitHelper.waitForVisible(dropdown);
    await dropdown.selectOption({ label: value });
  }

  async getSelectedOption(dropdown: Locator): Promise<string> {
    await this.waitHelper.waitForVisible(dropdown);

    const selectedOption = dropdown.locator("option:checked");
    const text = await selectedOption.textContent();
    return text?.trim() || "";
  }

  async getAllOptions(dropdown: Locator): Promise<string[]> {
    Logger.info("Obteniendo todas las opciones del dropdown");
    await this.waitHelper.waitForVisible(dropdown);

    const options = dropdown.locator("option");
    const count = await options.count();
    const optionsList: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text && text.trim()) optionsList.push(text.trim());
    }

    Logger.info(`Opciones encontradas: ${optionsList.join(", ")}`);
    return optionsList;
  }

  async verifyOptions(
    dropdown: Locator,
    expectedOptions: string[],
  ): Promise<void> {
    Logger.info(
      `Verificando opciones esperadas: ${expectedOptions.join(", ")}`,
    );
    const actualOptions = await this.getAllOptions(dropdown);

    for (const expected of expectedOptions) {
      if (!actualOptions.includes(expected)) {
        throw new Error(
          `Opción "${expected}" no encontrada. Opciones disponibles: ${actualOptions.join(", ")}`,
        );
      }
    }
  }
}
