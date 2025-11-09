import { PaginationQuery } from '@/common/types/request';

/**
 * @description 数字生命核心状态
 */
export interface LifeStatus {
  id: number;
  name: string;
  likes: number;
  visitors: number;
  comments: number;
  lifespan: string; // ISO 8601 string
  createdAt: string; // ISO 8601 string
  tools: number;
  creations: number;
}

/**
 * @description 数字生命单条评论
 */
export interface LifeComment {
  id: number;
  content: string;
  replyContent: string | null;
  createdAt: string; // ISO 8601 string
}

/**
 * @description 获取评论列表的请求参数
 */
export interface GetLifeCommentsParams extends PaginationQuery {}

/**
 * @description 发表评论的请求体
 */
export interface PostLifeCommentPayload {
  content: string;
}
