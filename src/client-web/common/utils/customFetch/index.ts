import { CustomFetch } from './customFetch.core';
import { camelCaseResponseInterceptor } from './customFetch.interceptors';
import {
  ApiError,
  ResponseInterceptor,
  TokenProvider,
} from './customFetch.type';

// 导入所需类型

// ============= 工厂函数和默认实例 =============

function createTokenProvider(): TokenProvider {
  return () => {
    if (typeof window === 'undefined') return null;
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) return null;
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    } catch {
      return null;
    }
  };
}

/**
 * 创建一个带有默认配置的 CustomFetch 实例
 * @param baseUrl API 基础地址
 */
function createDefaultInstance(baseUrl?: string): CustomFetch {
  const instance = new CustomFetch({ baseUrl });

  // 1. 设置 Token 提供者
  instance.setTokenProvider(createTokenProvider());

  instance.addResponseInterceptor(camelCaseResponseInterceptor);

  // 通用错误处理拦截器
  const globalErrorInterceptor: ResponseInterceptor = {
    onRejected: error => {
      console.error('API Error:', error);
      if (error instanceof ApiError && error.status === 401) {
        // 在这里处理全局的未授权逻辑，例如跳转登录页
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  };
  instance.addResponseInterceptor(globalErrorInterceptor);

  return instance;
}

// 创建并导出一个默认的、立即可用的实例
const customFetch = createDefaultInstance(
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
);

// ============= 导出 =============

// 导出所有类型，方便外部使用
export * from './customFetch.type';
// 导出核心类，允许用户自己创建实例
export { CustomFetch };
// 导出工厂函数，允许用户创建带有不同配置的实例
export { createDefaultInstance };
// 默认导出单例，这是最常用的方式
export default customFetch;
