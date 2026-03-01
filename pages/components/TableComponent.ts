import { Page, Locator } from "@playwright/test";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { Logger } from "../../utils/reporting/Logger";

// Componente reutilizable para tablas
export class TableComponent {
  private page: Page;
  private waitHelper: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.waitHelper = new WaitHelper(page);
  }

  // Obtener tabla por título (asumiendo estructura: <h2>Title</h2><table>...</table>)
  getTable(tableTitle: string): Locator {
    return this.page.locator(`h2:has-text("${tableTitle}") + table`);
  }

  // Obtener tabla por selector personalizado
  getTableBySelector(selector: string): Locator {
    return this.page.locator(selector);
  }

  // Obtener valores de una columna específica
  async getColumnValues(
    tableTitle: string,
    columnIndex: number,
  ): Promise<string[]> {
    Logger.info(
      `Getting column ${columnIndex} values from table: ${tableTitle}`,
    );
    const selector = `h2:has-text("${tableTitle}") + table tbody tr td:nth-child(${columnIndex})`;
    return await this.page.$$eval(selector, (elements) =>
      elements.map((el) => el.textContent?.trim() || ""),
    );
  }

  // Obtener número de filas
  async getRowCount(tableTitle: string): Promise<number> {
    const table = this.getTable(tableTitle);
    await this.waitHelper.waitForElement(table);
    return await table.locator("tbody tr").count();
  }

  // Obtener número de columnas (asumiendo todas las filas tienen el mismo número de columnas)
  async getColumnCount(tableTitle: string): Promise<number> {
    const table = this.getTable(tableTitle);
    await this.waitHelper.waitForElement(table);
    const firstRow = table.locator("tbody tr").first();
    return await firstRow.locator("td").count();
  }

  // Obtener valor de celda específica
  async getCellValue(
    tableTitle: string,
    row: number,
    column: number,
  ): Promise<string> {
    const selector = `h2:has-text("${tableTitle}") + table tbody tr:nth-child(${row}) td:nth-child(${column})`;
    const cell = this.page.locator(selector);
    await this.waitHelper.waitForElement(cell);
    return (await cell.textContent()) || "";
  }

  // Obtener valores de una fila específica
  async getRowValues(tableTitle: string, rowIndex: number): Promise<string[]> {
    const table = this.getTable(tableTitle);
    const row = table.locator(`tbody tr:nth-child(${rowIndex})`);
    return await row.locator("td").allTextContents();
  }

  // Obtener toda la data de la tabla
  async getAllTableData(tableTitle: string): Promise<string[][]> {
    Logger.info(`Getting all data from table: ${tableTitle}`);
    const table = this.getTable(tableTitle);
    await this.waitHelper.waitForElement(table);

    const rows = await table.locator("tbody tr").all();
    const data: string[][] = [];

    for (const row of rows) {
      const cells = await row.locator("td").allTextContents();
      data.push(cells.map((cell) => cell.trim()));
    }

    return data;
  }

  // Encontrar índice de fila por valor en columna específica
  async findRowByColumnValue(
    tableTitle: string,
    columnIndex: number,
    value: string,
  ): Promise<number | null> {
    const columnValues = await this.getColumnValues(tableTitle, columnIndex);
    const index = columnValues.findIndex((v) => v === value);
    return index >= 0 ? index + 1 : null; // +1 porque las filas empiezan en 1
  }

  // Verificar que tabla contiene texto específico
  async verifyTableContains(
    tableTitle: string,
    text: string,
  ): Promise<boolean> {
    const table = this.getTable(tableTitle);
    const textContent = await table.textContent();
    return textContent?.includes(text) || false;
  }

  // Click en celda específica
  async clickCell(
    tableTitle: string,
    row: number,
    column: number,
  ): Promise<void> {
    const selector = `h2:has-text("${tableTitle}") + table tbody tr:nth-child(${row}) td:nth-child(${column})`;
    const cell = this.page.locator(selector);
    await cell.click();
  }
}
