/**
 * Builder para construir requests complejos
 */
export class RequestBuilder {
  private url: string = "";
  private headers: Record<string, string> = {};
  private queryParams: Record<string, string> = {};
  private body: any = null;

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  addHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  addQueryParam(key: string, value: string): this {
    this.queryParams[key] = value;
    return this;
  }

  addQueryParams(params: Record<string, string>): this {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  setBody(body: any): this {
    this.body = body;
    return this;
  }

  buildURL(): string {
    if (Object.keys(this.queryParams).length === 0) {
      return this.url;
    }

    const params = new URLSearchParams(this.queryParams);
    return `${this.url}?${params.toString()}`;
  }

  getConfig() {
    return {
      headers: this.headers,
      data: this.body,
    };
  }

  reset(): this {
    this.url = "";
    this.headers = {};
    this.queryParams = {};
    this.body = null;
    return this;
  }
}
