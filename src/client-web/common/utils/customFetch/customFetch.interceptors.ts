import { camelizeKeys, decamelizeKeys } from 'humps';

import { RequestInterceptor, ResponseInterceptor } from './customFetch.type';

/**
 * 请求拦截器：将请求体中的 JSON 数据从 camelCase 转换为 snake_case。
 * 注意：此拦截器假设 body 是一个将要被 JSON.stringify 的对象。
 * 它应该在 JSON.stringify 之前执行。
 */
export const snakeCaseRequestInterceptor: RequestInterceptor = async config => {
  // 检查 body 是否为普通对象，排除 FormData, Blob 等特殊类型
  if (
    config.body &&
    typeof config.body === 'object' &&
    !(config.body instanceof Blob) &&
    !(config.body instanceof FormData)
  ) {
    try {
      // 直接转换对象，而不是解析字符串
      config.body = JSON.stringify(decamelizeKeys(config.body));
    } catch (e) {
      console.error('Failed to decamelize request body:', e);
      // 如果转换失败，保持原始 body
    }
  }
  return config;
};

/**
 * 响应拦截器：将响应体中的 JSON 数据从 snake_case 转换为 camelCase。
 */
export const camelCaseResponseInterceptor: ResponseInterceptor = {
  onFulfilled: async response => {
    // 克隆响应以多次读取 body
    const clonedResponse = response.clone();
    const contentType = clonedResponse.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        const json = await clonedResponse.json();
        const camelizedJson = camelizeKeys(json);

        // 创建一个新的 Response 对象，因为原始 body 已经被消耗
        return new Response(JSON.stringify(camelizedJson), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } catch (error) {
        // 如果 JSON 解析或转换失败，返回原始响应让后续逻辑处理
        console.error('Failed to parse and camelize response:', error);
        return response;
      }
    }

    // 如果不是 JSON，则返回原始响应
    return response;
  },
  // onRejected 可以为空，因为此拦截器不处理错误情况
};
