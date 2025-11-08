// src/features/creation/creation.hook.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as creationApi from './creation.api';
import type { PaginationParams, PostCommentPayload } from './creation.type';

/**
 * Query Keys Factory for Creations
 * 用于生成结构化、可预测的查询键
 */
export const creationKeys = {
  all: ['creations'] as const,
  lists: () => [...creationKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...creationKeys.lists(), params] as const,
  details: () => [...creationKeys.all, 'detail'] as const,
  detail: (id: number) => [...creationKeys.details(), id] as const,
  comments: (id: number) => [...creationKeys.details(), id, 'comments'] as const,
  commentList: (id: number, params: PaginationParams) => [...creationKeys.comments(id), params] as const,
};

/**
 * Hook to fetch a paginated list of creations.
 * @param params - Pagination parameters { page, pageSize }
 */
export const useGetCreations = (params: PaginationParams) => {
  return useQuery({
    queryKey: creationKeys.list(params),
    queryFn: () => creationApi.getCreations(params),
  });
};

/**
 * Hook to fetch the details of a single creation.
 * @param creationId - The ID of the creation.
 */
export const useGetCreationDetail = (creationId: number) => {
  return useQuery({
    queryKey: creationKeys.detail(creationId),
    queryFn: () => creationApi.getCreationDetail(creationId),
    // 仅当 creationId 有效时才执行查询
    enabled: !!creationId,
  });
};

/**
 * Hook to fetch the comments for a creation.
 * @param creationId - The ID of the creation.
 * @param params - Pagination parameters { page, pageSize }
 */
export const useGetCreationComments = (creationId: number, params: PaginationParams) => {
  return useQuery({
    queryKey: creationKeys.commentList(creationId, params),
    queryFn: () => creationApi.getCreationComments(creationId, params),
    enabled: !!creationId,
  });
};

/**
 * Hook for liking a creation.
 * Provides a `mutate` function to trigger the like action.
 * Handles automatic invalidation of related queries on success.
 */
export const useLikeCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creationApi.likeCreation, // mutationFn 接受 creationId
    onSuccess: (data, creationId) => {
      // 成功后，使该作品的详情缓存失效，以便自动重新获取最新数据
      queryClient.invalidateQueries({ queryKey: creationKeys.detail(creationId) });
      // 如果作品列表也显示点赞数，也需要使其失效
      // queryClient.invalidateQueries({ queryKey: creationKeys.lists() });
    },
    // 可选：添加 optimistic updates 以获得更好的用户体验
  });
};

/**
 * Hook for posting a new comment to a creation.
 * Provides a `mutate` function to trigger the post action.
 * Handles automatic invalidation of related queries on success.
 */
export const usePostCreationComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creationApi.postCreationComment, // mutationFn 接受 { creationId, payload }
    onSuccess: (data, variables) => {
      const { creationId } = variables;
      // 评论成功后，使该作品的评论列表缓存失效
      queryClient.invalidateQueries({ queryKey: creationKeys.comments(creationId) });
      // 同时，作品详情中的评论总数也已过时，使其失效
      queryClient.invalidateQueries({ queryKey: creationKeys.detail(creationId) });
    },
  });
};