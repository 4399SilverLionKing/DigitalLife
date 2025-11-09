// src/features/thought/thought.hook.ts
import { useQuery } from '@tanstack/react-query';

import { PaginationQuery } from '@/common/types/request';

import * as thoughtApi from './thought.api';

/**
 * Query Keys Factory for Thoughts
 * 用于为 "thoughts" 功能生成结构化、一致的查询键
 */
export const thoughtKeys = {
  all: ['thoughts'] as const,
  lists: () => [...thoughtKeys.all, 'list'] as const,
  list: (params: PaginationQuery) => [...thoughtKeys.lists(), params] as const,
};

/**
 * Hook to fetch a paginated list of thoughts.
 * 当 `params` (分页参数) 改变时，TanStack Query 会自动重新获取数据。
 * @param params - Pagination parameters { page, pageSize }
 */
export const useGetThoughts = (params: PaginationQuery) => {
  return useQuery({
    // 查询键包含分页参数，以确保不同页面的数据被独立缓存
    queryKey: thoughtKeys.list(params),
    queryFn: () => thoughtApi.getThoughts(params),
    // 保持数据为最新状态，但也可以根据需求配置 staleTime
    // staleTime: 5 * 60 * 1000, // 例如：5分钟内数据被认为是新鲜的
  });
};
