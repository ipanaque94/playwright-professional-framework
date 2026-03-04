import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { SandboxSelectors } from "./SandboxSelectors";
import { CheckboxComponent } from "../components/CheckboxComponent";
import { RadioButtonComponent } from "../components/RadioButtonComponent";
import { DropdownComponent } from "../components/DropdownComponent";
import { PopupComponent } from "../components/PopupComponent";
import { FormComponent } from "../components/FormComponent";
import { TableComponent } from "../components/TableComponent";
import { Logger } from "../../utils/reporting/Logger";

export class SandboxPage extends BasePage {
  // Componentes
  readonly checkbox: CheckboxComponent;
  readonly radio: RadioButtonComponent;
  readonly dropdown: DropdownComponent;
  readonly popup: PopupComponent;
  readonly form: FormComponent;
  readonly table: TableComponent;

  // Elementos propios
  readonly dynamicButton: Locator;
  readonly hiddenElement: Locator;
  readonly sportsDropdown: Locator;
  readonly weekdayDropdown: Locator;
  readonly uploadFileInput: Locator;

  constructor(page: Page) {
    super(
      page,
      "https://thefreerangetester.github.io/sandbox-automation-testing/",
    );

    // Inicializar componentes
    this.checkbox = new CheckboxComponent(page);
    this.radio = new RadioButtonComponent(page);
    this.dropdown = new DropdownComponent(page);
    this.popup = new PopupComponent(page);
    this.form = new FormComponent(page);
    this.table = new TableComponent(page);

    // Inicializar elementos
    this.dynamicButton = page.getByRole(SandboxSelectors.DYNAMIC_BUTTON.role, {
      name: SandboxSelectors.DYNAMIC_BUTTON.name,
    });
    this.hiddenElement = page.getByText("OMG, aparezco después de 3 segundos");
    this.sportsDropdown = page.locator("select#formBasicSelect");
    this.weekdayDropdown = page.getByRole("button", {
      name: "Día de la semana",
    });
    this.uploadFileInput = page.getByLabel("Upload file");
  }

  getURL(): string {
    return "https://thefreerangetester.github.io/sandbox-automation-testing/";
  }

  // Dynamic ID Section
  async clickDynamicButton(): Promise<void> {
    await this.waitHelper.waitForVisible(this.dynamicButton);
    await this.elementHelper.click(this.dynamicButton);
    Logger.info("✅ Click en botón dinámico");
  }

  async verifyHiddenElementAppears(): Promise<void> {
    await this.waitHelper.waitForVisible(this.hiddenElement);
    Logger.info("✅ Elemento oculto visible");
  }

  // Text Input Section
  async enterText(text: string): Promise<void> {
    await this.form.fill(text);
  }

  async clearTextInput(): Promise<void> {
    await this.form.clear();
  }

  async getTextInputValue(): Promise<string> {
    return await this.form.getValue();
  }

  // Checkbox Section
  async checkPasta(): Promise<void> {
    await this.checkbox.check("Pasta 🍝");
  }

  async uncheckPasta(): Promise<void> {
    await this.checkbox.uncheck("Pasta 🍝");
  }

  async checkMultipleFoods(foods: string[]): Promise<void> {
    await this.checkbox.checkMultiple(foods);
  }

  async getCheckedFoods(): Promise<string[]> {
    const foods = [
      "Pizza 🍕",
      "Hamburguesa 🍔",
      "Pasta 🍝",
      "Helado 🍧",
      "Torta 🍰",
    ];
    return await this.checkbox.getCheckedLabels(foods);
  }

  // Radio Button Section
  async selectYesRadio(): Promise<void> {
    await this.radio.selectYes();
  }

  async selectNoRadio(): Promise<void> {
    await this.radio.selectNo();
  }

  // Dropdown Section
  async selectSport(sport: string): Promise<void> {
    await this.dropdown.selectByValue(this.sportsDropdown, sport);
  }

  async getSelectedSport(): Promise<string> {
    return await this.dropdown.getSelectedOption(this.sportsDropdown);
  }

  async getAllSportsOptions(): Promise<string[]> {
    return await this.dropdown.getAllOptions(this.sportsDropdown);
  }

  async verifySportsOptions(expectedOptions: string[]): Promise<void> {
    await this.dropdown.verifyOptions(this.sportsDropdown, expectedOptions);
  }

  // Weekday Section
  async selectWeekday(day: string): Promise<void> {
    await this.dropdown.selectWeekday(day);
  }

  // Table Section
  async getStaticTableNames(): Promise<string[]> {
    return await this.table.getStaticTableColumn(2);
  }

  async getDynamicTableValues(): Promise<string[]> {
    return await this.table.getDynamicTableValues();
  }

  async getStaticTableRowCount(): Promise<number> {
    return await this.table.getRowCount();
  }

  // Popup Section
  async openPopup(): Promise<void> {
    await this.popup.open();
  }

  async closePopup(): Promise<void> {
    await this.popup.close();
  }

  async verifyPopupVisible(): Promise<void> {
    await this.popup.verifyVisible("¿Viste? ¡Apareció un Pop-up!");
  }

  async getPopupText(): Promise<string> {
    return await this.popup.getText();
  }

  /* File Upload Section
  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
    Logger.info(`✅ Archivo subido: ${filePath}`);
  }

  async uploadMultipleFiles(filePaths: string[]): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePaths);
    Logger.info(`✅ ${filePaths.length} archivos subidos`);
  }
*/
  async clearUploadedFiles(): Promise<void> {
    await this.uploadFileInput.setInputFiles([]);
    Logger.info("✅ Archivos limpiados");
  }
}
