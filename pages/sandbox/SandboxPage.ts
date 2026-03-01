import { Page, Locator } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { CheckboxComponent } from "../components/CheckboxComponent";
import { DropdownComponent } from "../components/DropdownComponent";
import { RadioButtonComponent } from "../components/RadioButtonComponent";
import { TableComponent } from "../components/TableComponent";
import { PopupComponent } from "../components/PopupComponent";
import { FormComponent } from "../components/FormComponent";

// Página de Sandbox con múltiples componentes para pruebas de automatización
export class SandboxPage extends BasePage {
  // Componentes
  public checkboxComponent: CheckboxComponent;
  public dropdownComponent: DropdownComponent;
  public radioComponent: RadioButtonComponent;
  public tableComponent: TableComponent;
  public popupComponent: PopupComponent;
  public formComponent: FormComponent;

  // Locators
  readonly dynamicIdButton: Locator;
  readonly hiddenElement: Locator;
  readonly textInput: Locator;
  readonly sportsDropdown: Locator;
  readonly weekdayDropdown: Locator;
  readonly uploadFileInput: Locator;

  constructor(page: Page) {
    super(page);

    // Inicializar componentes
    this.checkboxComponent = new CheckboxComponent(page);
    this.dropdownComponent = new DropdownComponent(page);
    this.radioComponent = new RadioButtonComponent(page);
    this.tableComponent = new TableComponent(page);
    this.popupComponent = new PopupComponent(page);
    this.formComponent = new FormComponent(page);

    // Inicializar locators
    this.dynamicIdButton = page.getByRole("button", {
      name: "Hacé click para generar un ID dinámico y mostrar el elemento oculto",
    });
    this.hiddenElement = page.getByText("OMG, aparezco después de 3 segundos");
    this.textInput = page.getByPlaceholder("Ingresá texto");
    this.sportsDropdown = page.getByLabel("Dropdown");
    this.weekdayDropdown = page.getByRole("button", {
      name: "Día de la semana",
    });
    this.uploadFileInput = page.getByLabel("Upload file");
  }

  getURL(): string {
    return "https://thefreerangetester.github.io/sandbox-automation-testing/";
  }

  // DYNAMIC ID SECTION

  async clickDynamicButton(): Promise<void> {
    await this.clickElement(this.dynamicIdButton, "Dynamic ID Button");
  }

  async verifyHiddenElementAppears(): Promise<void> {
    await this.verifyElementVisible(this.hiddenElement, "Hidden Element");
  }

  //TEXT INPUT SECTION

  async enterText(text: string): Promise<void> {
    await this.fillInput(this.textInput, text, "Text Input");
  }

  async clearTextInput(): Promise<void> {
    await this.elementHelper.clear(this.textInput);
  }

  async getTextInputValue(): Promise<string> {
    return await this.elementHelper.getValue(this.textInput);
  }

  // CHECKBOX SECTION

  async checkPasta(): Promise<void> {
    await this.checkboxComponent.check("Pasta 🍝");
  }

  async uncheckPasta(): Promise<void> {
    await this.checkboxComponent.uncheck("Pasta 🍝");
  }

  async checkMultipleFoods(foods: string[]): Promise<void> {
    await this.checkboxComponent.checkMultiple(foods);
  }

  async getCheckedFoods(): Promise<string[]> {
    const foods = [
      "Pizza 🍕",
      "Hamburguesa 🍔",
      "Pasta 🍝",
      "Helado 🍧",
      "Torta 🍰",
    ];
    return await this.checkboxComponent.getCheckedLabels(foods);
  }

  //RADIO BUTTON SECTION

  async selectYesRadio(): Promise<void> {
    await this.radioComponent.select("Si");
  }

  async selectNoRadio(): Promise<void> {
    await this.radioComponent.select("No");
  }

  //DROPDOWN SECTION

  async selectSport(sport: string): Promise<void> {
    await this.dropdownComponent.selectByValue(this.sportsDropdown, sport);
  }

  async getSelectedSport(): Promise<string> {
    return await this.dropdownComponent.getSelectedOption(this.sportsDropdown);
  }

  async getAllSportsOptions(): Promise<string[]> {
    return await this.dropdownComponent.getAllOptions(this.sportsDropdown);
  }

  async verifySportsOptions(expectedOptions: string[]): Promise<void> {
    await this.dropdownComponent.verifyOptions(
      this.sportsDropdown,
      expectedOptions,
    );
  }

  // WEEKDAY DROPDOWN SECTION

  async selectWeekday(day: string): Promise<void> {
    await this.weekdayDropdown.click();
    await this.page.getByRole("link", { name: day }).click();
  }

  //TABLE SECTION

  async getStaticTableNames(): Promise<string[]> {
    return await this.tableComponent.getColumnValues("Tabla estática", 2);
  }

  async getDynamicTableData(): Promise<string[][]> {
    return await this.tableComponent.getAllTableData("Tabla dinámica");
  }

  async getStaticTableRowCount(): Promise<number> {
    return await this.tableComponent.getRowCount("Tabla estática");
  }

  async getCellValue(table: string, row: number, col: number): Promise<string> {
    return await this.tableComponent.getCellValue(table, row, col);
  }

  // POPUP SECTION

  async openPopup(): Promise<void> {
    await this.popupComponent.open();
  }

  async closePopup(): Promise<void> {
    await this.popupComponent.close();
  }

  async verifyPopupVisible(): Promise<void> {
    await this.popupComponent.verifyPopupVisible(
      "¿Viste? ¡Apareció un Pop-up!",
    );
  }

  async getPopupText(): Promise<string> {
    return await this.popupComponent.getPopupText();
  }

  //FILE UPLOAD SECTION

  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  async uploadMultipleFiles(filePaths: string[]): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePaths);
  }

  async clearUploadedFiles(): Promise<void> {
    await this.uploadFileInput.setInputFiles([]);
  }
}
