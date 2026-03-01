import { APIResponse, expect } from "@playwright/test";

/**
 * Validador de respuestas API
 */
export class ResponseValidator {
  static async validateStatusCode(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  static async validateIsJSON(response: APIResponse): Promise<void> {
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  }

  static async validateSchema(
    response: APIResponse,
    schema: any,
  ): Promise<void> {
    const json = await response.json();

    for (const [key, type] of Object.entries(schema)) {
      expect(typeof json[key]).toBe(type);
    }
  }

  static async validateHasField(
    response: APIResponse,
    field: string,
  ): Promise<void> {
    const json = await response.json();
    expect(json).toHaveProperty(field);
  }

  static async validateHasFields(
    response: APIResponse,
    fields: string[],
  ): Promise<void> {
    const json = await response.json();
    fields.forEach((field) => {
      expect(json).toHaveProperty(field);
    });
  }

  static validateResponseTime(time: number, maxTime: number): void {
    expect(time).toBeLessThan(maxTime);
  }

  static async validateNonEmptyArray(response: APIResponse): Promise<void> {
    const json = await response.json();
    expect(Array.isArray(json)).toBeTruthy();
    expect(json.length).toBeGreaterThan(0);
  }

  static async validateArrayLength(
    response: APIResponse,
    expectedLength: number,
  ): Promise<void> {
    const json = await response.json();
    expect(Array.isArray(json)).toBeTruthy();
    expect(json.length).toBe(expectedLength);
  }

  static async validateFieldValue(
    response: APIResponse,
    field: string,
    expectedValue: any,
  ): Promise<void> {
    const json = await response.json();
    expect(json[field]).toBe(expectedValue);
  }

  static async validateContainsText(
    response: APIResponse,
    text: string,
  ): Promise<void> {
    const body = await response.text();
    expect(body).toContain(text);
  }
}
