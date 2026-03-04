import { BaseSelectors } from "../base/BaseSelectors";

export class PopupSelectors {
  static readonly SHOW_BUTTON = BaseSelectors.button("Mostrar popup");
  static readonly CLOSE_BUTTON = BaseSelectors.button("Cerrar");
  static readonly CONTENT = BaseSelectors.dialog();
}
