import {
  ApiError,
  ApiResponse,
  BackendResponse,
  BlobResponse,
  CustomRequestConfig,
  DEFAULT_HEADERS,
  HTTP_STATUS_MESSAGES,
  RequestInterceptor,
  ResponseCode,
  ResponseInterceptor,
  TokenProvider,
} from './customFetch.type';

/**
 * 一个封装了拦截器、自动认证、统一错误处理等功能的 fetch 客户端核心类。
 * 这个类是纯粹的，不包含任何特定业务的拦截器或配置。
 */
export class CustomFetch {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private tokenProvider: TokenProvider | null = null;

  constructor(options: { baseUrl?: string } = {}) {
    this.baseUrl = options.baseUrl || '';
  }

  // ============= 公共配置方法 =============

  /**
   * 设置一个动态获取 Token 的函数。
   * @param provider 一个返回 Token 字符串或 Promise 的函数。
   */
  public setTokenProvider(provider: TokenProvider): void {
    this.tokenProvider = provider;
  }

  /**
   * 添加一个请求拦截器。
   * @param interceptor 请求拦截器函数。
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加一个响应拦截器。
   * @param interceptor 响应拦截器对象，包含 onFulfilled 和 onRejected 方法。
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // ============= 核心请求方法 =============

  /**
   * 发起一个通用请求，并期望得到 JSON 响应。
   * @template T 响应体中 `data` 字段的类型。
   * @param url 请求的 URL。
   * @param config 请求的配置，扩展了原生的 RequestInit。
   * @returns 返回一个 Promise，解析为 ApiResponse<T> 格式。
   */
  public async request<T = any>(
    url: string,
    config: CustomRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const { params, ...restConfig } = config;
      const resolvedUrl = this.resolveUrl(url);
      const finalUrl = this.buildUrlWithParams(resolvedUrl, params);

      const response = await this.executeRequest(finalUrl, restConfig);
      const parsedResponse = await this.parseResponse<T>(response);

      if (!response.ok) {
        // 如果响应状态码不是 2xx，即使 parseResponse 成功了（比如后端返回了错误信息的 JSON），
        // 也要在这里抛出错误，以便进入 catch 块和响应的 onRejected 拦截器。
        this.handleError(response, parsedResponse.data);
      }

      return parsedResponse;
    } catch (error) {
      // 统一处理所有错误（网络错误、解析错误、业务错误等），并应用 onRejected 拦截器
      return this.handleResponseError(error);
    }
  }

  /**
   * 发起一个请求，并将响应体作为 Blob 对象返回。
   * 主要用于文件下载等场景。
   * @param url 请求的 URL。
   * @param config 请求的配置。
   * @returns 返回一个 Promise，解析为 BlobResponse 格式。
   */
  public async requestBlob(
    url: string,
    config: CustomRequestConfig = {}
  ): Promise<BlobResponse> {
    try {
      const { params, ...restConfig } = config;
      const resolvedUrl = this.resolveUrl(url);
      const finalUrl = this.buildUrlWithParams(resolvedUrl, params);

      const response = await this.executeRequest(finalUrl, restConfig);

      if (!response.ok) {
        const errorData = await this.parseErrorData(response);
        this.handleError(response, errorData);
      }

      const blob = await response.blob();
      return {
        blob,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return this.handleResponseError(error);
    }
  }

  // ============= 便捷方法 =============

  public async get<T = any>(
    url: string,
    config?: CustomRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: CustomRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T = any>(
    url: string,
    config?: CustomRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  // ============= 私有工具方法 =============

  private async executeRequest(
    url: string,
    config: RequestInit
  ): Promise<Response> {
    const interceptedConfig = await this.applyRequestInterceptors(config);
    const headers = await this.prepareHeaders(interceptedConfig.headers);

    const response = await fetch(url, {
      ...interceptedConfig,
      headers,
    });

    return this.applyResponseInterceptors(response);
  }

  private resolveUrl(url: string): string {
    if (/^(https?:)?\/\//.test(url)) {
      return url;
    }
    if (!this.baseUrl) {
      return url;
    }
    return new URL(url, this.baseUrl).href;
  }

  private buildUrlWithParams(
    url: string,
    params?: Record<string, any>
  ): string {
    if (!params) return url;
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString
      ? `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      : url;
  }

  private async prepareHeaders(headers: HeadersInit = {}): Promise<Headers> {
    const finalHeaders = new Headers({
      ...DEFAULT_HEADERS,
      ...headers,
    });

    if (this.tokenProvider) {
      const token = await this.tokenProvider();
      if (token) {
        finalHeaders.set('Authorization', `Bearer ${token}`);
      }
    }
    return finalHeaders;
  }

  private async applyRequestInterceptors(
    config: RequestInit
  ): Promise<RequestInit> {
    return this.requestInterceptors.reduce(
      async (configPromise, interceptor) => interceptor(await configPromise),
      Promise.resolve({ ...config })
    );
  }

  private async applyResponseInterceptors(
    response: Response
  ): Promise<Response> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        finalResponse = await interceptor.onFulfilled(finalResponse);
      }
    }
    return finalResponse;
  }

  private async handleResponseError(error: any): Promise<never> {
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onRejected) {
        throw await interceptor.onRejected(error);
      }
    }
    throw error;
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let rawData: any;

    try {
      if (response.status === 204 || response.status === 205) {
        // No Content
        rawData = null;
      } else if (contentType?.includes('application/json')) {
        rawData = await response.json();
      } else {
        rawData = await response.text();
      }
    } catch (error) {
      throw new ApiError(
        response.status,
        'Failed to parse response body',
        error
      );
    }

    if (this.isBackendResponse(rawData)) {
      const backendResponse = rawData as BackendResponse<T>;
      if (backendResponse.code !== ResponseCode.SUCCESS) {
        throw new ApiError(
          response.status,
          backendResponse.message,
          backendResponse
        );
      }
      return this.createApiResponse(backendResponse.data, response);
    }

    return this.createApiResponse(rawData as T, response);
  }

  private isBackendResponse(data: any): boolean {
    return (
      data && typeof data === 'object' && 'code' in data && 'message' in data
    );
  }

  private createApiResponse<T>(data: T, response: Response): ApiResponse<T> {
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  private async parseErrorData(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get('content-type');
      return contentType?.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch {
      return response.statusText;
    }
  }

  private createErrorMessage(status: number, data: any): string {
    if (data && typeof data === 'object' && data.message) {
      return data.message;
    }
    return (
      HTTP_STATUS_MESSAGES[status] || `Request failed with status ${status}`
    );
  }

  private handleError(response: Response, data: any): never {
    const message = this.createErrorMessage(response.status, data);
    throw new ApiError(response.status, message, data);
  }
}
