// src/features/thought/thought.api.ts
import { PaginationQuery } from '@/common/types/request';
import customFetch from '@/common/utils/customFetch/index';

import type { Thought } from './thought.type';

/**
 * 分页获取思考记录列表
 * @param params - 分页参数 { page, pageSize }
 * @returns 思考记录列表数组
 */
export const getThoughts = async (
  params: PaginationQuery
): Promise<Thought[]> => {
  const response = await customFetch.get<Thought[]>('/api/thoughts', {
    params,
  });
  return response.data;
};
