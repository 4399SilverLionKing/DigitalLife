/**
 * 通用分页查询参数
 * 大部分列表接口都遵循此规范
 */
export interface PaginationQuery {
  /** 页码, 默认为 1 */
  page?: number;
  /** 每页数量, 默认为 10 或 20 */
  limit?: number;
}