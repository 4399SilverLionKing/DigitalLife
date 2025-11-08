// src/features/thought/thought.type.ts

/**
 * 通用分页查询参数
 * Note: This could be moved to a shared types file, e.g., src/common/types/api.ts
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * 单个思考记录的结构
 */
export interface Thought {
  id: number;
  cycleId: string;
  agentName: string;
  content: string;
  createdAt: string; // ISO 8601 格式的日期字符串
}