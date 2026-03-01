import { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "../reporting/Logger";

/**
 * Helper general para APIs
 */
export class APIHelper {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async get(url: string, options?: any): Promise<APIResponse> {
    Logger.apiRequest("GET", url);
    const response = await this.request.get(url, options);
    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  async post(url: string, data: any, options?: any): Promise<APIResponse> {
    Logger.apiRequest("POST", url, data);
    const response = await this.request.post(url, { data, ...options });
    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  async put(url: string, data: any, options?: any): Promise<APIResponse> {
    Logger.apiRequest("PUT", url, data);
    const response = await this.request.put(url, { data, ...options });
    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  async patch(url: string, data: any, options?: any): Promise<APIResponse> {
    Logger.apiRequest("PATCH", url, data);
    const response = await this.request.patch(url, { data, ...options });
    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  async delete(url: string, options?: any): Promise<APIResponse> {
    Logger.apiRequest("DELETE", url);
    const response = await this.request.delete(url, options);
    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  verifyStatusCode(response: APIResponse, expectedStatus: number): void {
    if (response.status() !== expectedStatus) {
      throw new Error(
        `Expected status ${expectedStatus}, but got ${response.status()}`,
      );
    }
  }

  async getJSON(response: APIResponse): Promise<any> {
    return await response.json();
  }

  async getText(response: APIResponse): Promise<string> {
    return await response.text();
  }

  getHeaders(response: APIResponse) {
    return response.headers();
  }

  async measureResponseTime(
    fn: () => Promise<APIResponse>,
  ): Promise<{ response: APIResponse; time: number }> {
    const startTime = Date.now();
    const response = await fn();
    const time = Date.now() - startTime;
    return { response, time };
  }

  private async getResponseBody(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }
}
