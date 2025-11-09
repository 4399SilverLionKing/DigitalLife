// src/features/life/life.api.ts
import customFetch from '@/common/utils/customFetch/index';

import type {
  GetLifeCommentsParams,
  LifeComment,
  LifeStatus,
  PostLifeCommentPayload,
} from './life.type';

/**
 * @description 获取数字生活状态
 * @returns {Promise<LifeStatus>} 数字生活状态数据
 */
export const getLifeStatus = async (): Promise<LifeStatus> => {
  const response = await customFetch.get<LifeStatus>('/api/life/status');
  return response.data;
};

/**
 * @description 分页获取数字生活评论列表
 * @param params - 分页参数 { page, pageSize }
 * @returns {Promise<LifeComment[]>} 评论列表数组
 */
export const getLifeComments = async (
  params: GetLifeCommentsParams
): Promise<LifeComment[]> => {
  const response = await customFetch.get<LifeComment[]>('/api/life/comments', {
    params,
  });
  return response.data;
};

/**
 * @description 发表一条新的数字生活评论
 * @param payload - 评论内容 { content }
 * @returns {Promise<LifeComment>} 新创建的评论对象
 */
export const postLifeComment = async (
  payload: PostLifeCommentPayload
): Promise<LifeComment> => {
  const response = await customFetch.post<LifeComment>(
    '/api/life/comments',
    payload
  );
  return response.data;
};
