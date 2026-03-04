import { BaseSelectors } from "../base/BaseSelectors";

export class SandboxSelectors {
  static readonly DYNAMIC_BUTTON = BaseSelectors.button(/Hacé click/i);
  static readonly HIDDEN_ELEMENT = BaseSelectors.testId("hidden-element");
}
