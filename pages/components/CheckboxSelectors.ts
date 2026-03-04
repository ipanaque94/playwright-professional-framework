import { BaseSelectors } from "../base/BaseSelectors";

export class CheckboxSelectors {
  static checkbox(name: string) {
    return BaseSelectors.checkbox(name);
  }

  static readonly ALL_CHECKBOXES = { role: "checkbox" as const };
}
