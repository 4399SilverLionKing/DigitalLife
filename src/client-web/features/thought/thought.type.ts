// src/features/thought/thought.type.ts

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
