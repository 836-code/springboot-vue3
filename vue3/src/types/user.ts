// 用户类型定义
export interface User {
  id?: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  status: 0 | 1; // 0: 禁用, 1: 启用
  createTime?: string;
  updateTime?: string;
}

// 用户列表请求参数
export interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  role?: string;
  status?: number;
}

// 用户列表响应数据
export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}
