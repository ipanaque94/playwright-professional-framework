// Selectors reutilizables para elementos comunes en la aplicación

export class BaseSelectors {
  static button(name: string | RegExp) {
    return { role: "button" as const, name };
  }

  static link(name: string | RegExp) {
    return { role: "link" as const, name };
  }

  static textbox(name?: string) {
    return { role: "textbox" as const, name };
  }

  static checkbox(name: string) {
    return { role: "checkbox" as const, name };
  }

  static radio(name: string) {
    return { role: "radio" as const, name };
  }

  static dialog() {
    return { role: "dialog" as const };
  }

  static table() {
    return { role: "table" as const };
  }

  static cell(name?: string) {
    return { role: "cell" as const, name };
  }

  static row() {
    return { role: "row" as const };
  }

  static testId(id: string) {
    return { testId: id };
  }
}
