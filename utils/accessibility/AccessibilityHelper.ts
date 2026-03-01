import { Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Helper para pruebas de accesibilidad
 */
export class AccessibilityHelper {
  static async runWCAGScan(page: Page, tags: string[] = ["wcag2a", "wcag2aa"]) {
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();

    return results;
  }

  static async checkKeyboardNavigation(page: Page): Promise<boolean> {
    await page.keyboard.press("Tab");

    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tagName: el?.tagName,
        type: (el as HTMLElement)?.getAttribute("type"),
        role: (el as HTMLElement)?.getAttribute("role"),
      };
    });

    const interactiveElements = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"];
    return interactiveElements.includes(focusedElement.tagName ?? "");
  }

  static async checkImageAltText(
    page: Page,
  ): Promise<{ total: number; missing: number }> {
    const images = await page.locator("img").all();
    let missing = 0;

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      if (alt === null) missing++;
    }

    return { total: images.length, missing };
  }

  static async checkColorContrast(page: Page): Promise<any> {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .include("button, a, p, h1, h2, h3")
      .analyze();

    return results.violations.filter((v) => v.id === "color-contrast");
  }
}
