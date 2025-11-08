// src/features/thought/thought.api.ts
import customFetch from '@/common/utils/customFetch';
import type { Thought, PaginationParams } from './thought.type';

/**
 * 分页获取思考记录列表
 * @param params - 分页参数 { page, pageSize }
 * @returns 思考记录列表数组
 */
export const getThoughts = async (params: PaginationParams): Promise<Thought[]> => {
  const response = await customFetch.get<Thought[]>('/api/thoughts', { params });
  return response.data;
};