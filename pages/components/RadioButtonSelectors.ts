import { BaseSelectors } from "../base/BaseSelectors";

export class RadioButtonSelectors {
  static readonly YES = BaseSelectors.radio("Si");
  static readonly NO = BaseSelectors.radio("No");

  static radio(name: string) {
    return BaseSelectors.radio(name);
  }
}
