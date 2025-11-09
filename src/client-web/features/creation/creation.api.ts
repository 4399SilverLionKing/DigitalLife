// src/features/creation/creation.api.ts
import customFetch from '@/common/utils/customFetch/index';

import type {
  CreationComment,
  CreationDetail,
  CreationListItem,
  LikeCreationResponse,
  PaginationParams,
  PostCommentPayload,
} from './creation.type';

/**
 * 分页获取作品列表
 * @param params - 分页参数 { page, pageSize }
 * @returns 作品列表数组
 */
export const getCreations = async (
  params: PaginationParams
): Promise<CreationListItem[]> => {
  const response = await customFetch.get<CreationListItem[]>('/api/creations', {
    params,
  });
  return response.data;
};

/**
 * 根据ID获取单个作品详情
 * @param creationId - 作品的唯一ID
 * @returns 作品详情对象
 */
export const getCreationDetail = async (
  creationId: number
): Promise<CreationDetail> => {
  const response = await customFetch.get<CreationDetail>(
    `/api/creations/${creationId}`
  );
  return response.data;
};

/**
 * 分页获取作品的评论列表
 * @param creationId - 作品的唯一ID
 * @param params - 分页参数 { page, pageSize }
 * @returns 作品评论列表数组
 */
export const getCreationComments = async (
  creationId: number,
  params: PaginationParams
): Promise<CreationComment[]> => {
  const response = await customFetch.get<CreationComment[]>(
    `/api/creations/${creationId}/comments`,
    { params }
  );
  return response.data;
};

/**
 * 点赞作品
 * @param creationId - 作品的唯一ID
 * @returns 包含最新点赞数对象
 */
export const likeCreation = async (
  creationId: number
): Promise<LikeCreationResponse> => {
  const response = await customFetch.post<LikeCreationResponse>(
    `/api/creations/${creationId}/like`
  );
  return response.data;
};

/**
 * 发表作品评论
 * @param creationId - 作品的唯一ID
 * @param payload - 评论内容 { content }
 * @returns 新创建的评论对象
 */
export const postCreationComment = async ({
  creationId,
  payload,
}: {
  creationId: number;
  payload: PostCommentPayload;
}): Promise<CreationComment> => {
  const response = await customFetch.post<CreationComment>(
    `/api/creations/${creationId}/comments`,
    {
      body: JSON.stringify(payload),
    }
  );
  return response.data;
};
