// ============= 类型定义 =============

/**
 * 请求拦截器函数类型
 */
export interface RequestInterceptor {
  (
    config: CustomRequestConfig
  ): CustomRequestConfig | Promise<CustomRequestConfig>;
}

/**
 * 响应拦截器接口
 */
export interface ResponseInterceptor {
  onFulfilled?: (response: Response) => Response | Promise<Response>;
  onRejected?: (error: any) => any;
}

/**
 * 后端标准响应体结构
 */
export interface BackendResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * CustomFetch 成功时返回的标准化响应结构
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * CustomFetch 请求 Blob 类型成功时返回的结构
 */
export interface BlobResponse {
  blob: Blob;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * 后端业务响应码枚举
 */
export enum ResponseCode {
  SUCCESS = 0,
  FAIL = 9999,
  SERVER_BUSY = 9998,
  API_UN_IMPL = 9997,
  CONTENT_TYPE_ERR = 9996,
  PARAMS_INVALID = 9995,
  SERVER_ERROR = 9994,
  FORBIDDEN = 403,
  UNAUTHORIZED = 401,
}

/**
 * 自定义 API 错误类
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Token 提供者函数类型
 */
export type TokenProvider = () => string | null | Promise<string | null>;

/**
 * 扩展原生 RequestInit，增加 params 属性
 */
export interface CustomRequestConfig extends RequestInit {
  params?: Record<string, any>;
}

// ============= 常量定义 =============

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Bad Request - 请求参数错误',
  401: 'Unauthorized - 未授权访问',
  403: 'Forbidden - 禁止访问',
  404: 'Not Found - 资源不存在',
  422: 'Unprocessable Entity - 请求参数验证失败',
  429: 'Too Many Requests - 请求过于频繁',
  500: 'Internal Server Error - 服务器内部错误',
  502: 'Bad Gateway - 网关错误',
  503: 'Service Unavailable - 服务不可用',
} as const;
