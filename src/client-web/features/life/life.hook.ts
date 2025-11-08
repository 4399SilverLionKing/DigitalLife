// src/features/life/life.hook.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as lifeApi from './life.api';
import type { GetLifeCommentsParams, PostLifeCommentPayload } from './life.type';

// Query Keys Factory
const lifeKeys = {
  all: ['life'] as const,
  status: () => [...lifeKeys.all, 'status'] as const,
  comments: (params: GetLifeCommentsParams) =>
    [...lifeKeys.all, 'comments', params] as const,
};

/**
 * @description 获取数字生活状态的Hook
 */
export const useGetLifeStatus = () => {
  return useQuery({
    queryKey: lifeKeys.status(),
    queryFn: lifeApi.getLifeStatus,
  });
};

/**
 * @description 获取数字生活评论列表的Hook
 * @param params 分页参数
 */
export const useGetLifeComments = (params: GetLifeCommentsParams) => {
  return useQuery({
    queryKey: lifeKeys.comments(params),
    queryFn: () => lifeApi.getLifeComments(params),
  });
};

/**
 * @description 发表评论的Hook
 */
export const usePostLifeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostLifeCommentPayload) =>
      lifeApi.postLifeComment(payload),
    /**
     * @description 评论成功后，使所有评论相关的查询失效，从而触发重新获取
     */
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifeKeys.comments({}) });
    },
    // 你也可以在这里添加 onError 和 onSettled 回调来处理错误或加载状态
  });
};