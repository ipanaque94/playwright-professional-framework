import { BaseSelectors } from "../base/BaseSelectors";

export class TableSelectors {
  static readonly STATIC_TABLE = {
    role: "table" as const,
    filter: { hasText: "Tabla estática" },
  };
  static readonly DYNAMIC_TABLE = {
    role: "table" as const,
    filter: { hasText: "Tabla dinámica" },
  };

  static cell(text: string) {
    return BaseSelectors.cell(text);
  }

  static readonly ALL_ROWS = BaseSelectors.row();
}
