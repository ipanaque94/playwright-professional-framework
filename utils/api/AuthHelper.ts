import { APIRequestContext } from "@playwright/test";

/**
 * Helper para autenticación
 */
export class AuthHelper {
  static createBasicAuthHeader(username: string, password: string): string {
    const credentials = Buffer.from(`${username}:${password}`).toString(
      "base64",
    );
    return `Basic ${credentials}`;
  }

  static createBearerTokenHeader(token: string): string {
    return `Bearer ${token}`;
  }

  static async loginAndGetToken(
    request: APIRequestContext,
    loginUrl: string,
    credentials: { email: string; password: string },
  ): Promise<string> {
    const response = await request.post(loginUrl, { data: credentials });
    const json = await response.json();
    return json.token;
  }

  static createAuthHeaders(token: string): Record<string, string> {
    return {
      Authorization: this.createBearerTokenHeader(token),
      "Content-Type": "application/json",
    };
  }
}
