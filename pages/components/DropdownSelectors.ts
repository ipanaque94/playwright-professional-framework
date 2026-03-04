import { BaseSelectors } from "../base/BaseSelectors";

export class DropdownSelectors {
  static readonly SPORT = BaseSelectors.button("Deportes");
  static readonly WEEKDAY = BaseSelectors.button("Día de la semana");

  static option(text: string) {
    return BaseSelectors.link(text);
  }
}
