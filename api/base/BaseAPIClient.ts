import { APIRequestContext, APIResponse } from "@playwright/test";
import { Logger } from "../../utils/reporting/Logger";

//Cliente base para todas las APIs

export abstract class BaseAPIClient {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  //GET request

  protected async get(endpoint: string, options?: any): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    Logger.apiRequest("GET", url);

    const response = await this.request.get(url, options);

    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  // POST request

  protected async post(
    endpoint: string,
    data: any,
    options?: any,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    Logger.apiRequest("POST", url, data);

    const response = await this.request.post(url, {
      data,
      ...options,
    });

    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  //PUT request

  protected async put(
    endpoint: string,
    data: any,
    options?: any,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    Logger.apiRequest("PUT", url, data);

    const response = await this.request.put(url, {
      data,
      ...options,
    });

    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  //PATCH request

  protected async patch(
    endpoint: string,
    data: any,
    options?: any,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    Logger.apiRequest("PATCH", url, data);

    const response = await this.request.patch(url, {
      data,
      ...options,
    });

    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  //DELETE request

  protected async delete(
    endpoint: string,
    options?: any,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    Logger.apiRequest("DELETE", url);

    const response = await this.request.delete(url, options);

    Logger.apiResponse(response.status(), await this.getResponseBody(response));
    return response;
  }

  //Obtener body de respuesta de forma segura

  private async getResponseBody(response: APIResponse): Promise<any> {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }

  //Verificar que respuesta es exitosa

  protected verifySuccess(response: APIResponse): void {
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()}`);
    }
  }
}
