/**
 * 通用分页查询参数
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 作品列表中的单个作品项
 */
export interface CreationListItem {
  id: number;
  title: string;
  assetUrl: string;
}

/**
 * 单个作品的详细信息
 */
export interface CreationDetail {
  id: number;
  type: 'image' | 'text' | string; // 使用联合类型以增强类型安全
  title: string;
  content: string;
  likes: number;
  comments: number;
  assetUrl: string;
  createdAt: string; // ISO 8601 格式的日期字符串
}

/**
 * 单个作品评论
 */
export interface CreationComment {
  id: number;
  content: string;
  creationId: number;
  replyContent: string | null;
  createdAt: string;
}

/**
 * 点赞作品接口的响应数据
 */
export interface LikeCreationResponse {
  likes: number;
}

/**
 * 发表评论接口的请求体 (Payload)
 */
export interface PostCommentPayload {
  content: string;
}