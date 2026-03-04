import { Page, Locator } from "@playwright/test";
import { WaitHelper } from "../../utils/ui/WaitHelper";
import { ElementHelper } from "../../utils/ui/ElementHelper";
import { Logger } from "../../utils/reporting/Logger";

export class TableComponent {
  private readonly waitHelper: WaitHelper;
  private readonly elementHelper: ElementHelper;

  constructor(private page: Page) {
    this.waitHelper = new WaitHelper(page);
    this.elementHelper = new ElementHelper(page);
  }

  // Obtener valores de una columna específica de tabla estática
  async getStaticTableColumn(columnIndex: number): Promise<string[]> {
    Logger.info(`Obteniendo columna ${columnIndex} de tabla estática`);

    const values = await this.page.$$eval(
      `h2:has-text("Tabla estática") + table tbody tr td:nth-child(${columnIndex})`,
      (elements) => elements.map((el) => el.textContent?.trim() || ""),
    );

    Logger.info(`Valores encontrados: ${values.join(", ")}`);
    return values;
  }

  // Obtener valores de tabla dinámica
  async getDynamicTableValues(): Promise<string[]> {
    Logger.info("Obteniendo valores de tabla dinámica");

    const values = await this.page.$$eval(
      'h2:has-text("Tabla dinámica") + table tbody tr td',
      (elements) => elements.map((el) => el.textContent?.trim() || ""),
    );

    Logger.info(`${values.length} valores encontrados`);
    return values;
  }

  // Obtener todos los valores de tabla estática
  async getCellValues(): Promise<string[]> {
    Logger.info("Obteniendo valores de tabla estática");

    const table = this.page
      .locator('h2:has-text("Tabla estática") + table')
      .first();
    await this.waitHelper.waitForVisible(table);

    const cells = table.getByRole("cell");
    const count = await cells.count();
    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.elementHelper.getText(cells.nth(i));
      if (text) values.push(text.trim());
    }

    Logger.info(`${values.length} celdas encontradas`);
    return values;
  }

  // Obtener cantidad de filas de tabla estática
  async getRowCount(): Promise<number> {
    const table = this.page
      .locator('h2:has-text("Tabla estática") + table')
      .first();
    await this.waitHelper.waitForVisible(table);

    const rows = table.getByRole("row");
    const count = await rows.count();
    Logger.info(`Tabla tiene ${count} filas`);
    return count;
  }

  // Obtener tabla estática
  getStaticTable(): Locator {
    return this.page.locator('h2:has-text("Tabla estática") + table').first();
  }

  //* Obtener tabla dinámica
  getDynamicTable(): Locator {
    return this.page.locator('h2:has-text("Tabla dinámica") + table').first();
  }
}
