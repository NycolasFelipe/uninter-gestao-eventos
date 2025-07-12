class BaseController {
  private baseURL = "http://localhost:3000/api/v0";

  private replaceEmptyWithNull(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.replaceEmptyWithNull(item));
    }

    const result: any = {}
    for (const key in data) {
      const value = data[key];
      result[key] = value === '' || value === undefined ? null : this.replaceEmptyWithNull(value);
    }
    return result;
  }

  protected async request(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
    }

    const processedData = data ? this.replaceEmptyWithNull(data) : undefined;

    const options: RequestInit = {
      method,
      headers,
      body: processedData ? JSON.stringify(processedData) : undefined
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return response.json();
  }

  protected get(endpoint: string): Promise<any> {
    return this.request(endpoint, "GET");
  }

  protected post(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, "POST", data);
  }

  protected patch(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, "PATCH", data);
  }

  protected put(endpoint: string, data: any): Promise<any> {
    return this.request(endpoint, "PUT", data);
  }

  protected delete(endpoint: string): Promise<any> {
    return this.request(endpoint, "DELETE");
  }
}

export default BaseController;