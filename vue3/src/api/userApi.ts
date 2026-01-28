import type { User } from '../types/user'
import type { UserListParams, UserListResponse } from '../types/user'; // 类型专用导入

import { mockUserList } from '../mock/userMock';

// 获取用户列表
export const getUserList = (params: UserListParams): Promise<{ data: UserListResponse }> => {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      let list = [...mockUserList];

      // 关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        list = list.filter(
          (item) =>
            item.username.toLowerCase().includes(keyword) ||
            item.name.toLowerCase().includes(keyword) ||
            item.email.toLowerCase().includes(keyword)
        );
      }

      // 角色筛选
      if (params.role) {
        list = list.filter((item) => item.role === params.role);
      }

      // 状态筛选
      if (params.status !== undefined) {
        list = list.filter((item) => item.status === params.status);
      }

      const total = list.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;

      // 分页
      const result = list.slice(start, end);

      resolve({
        data: {
          list: result,
          total,
          page: params.page,
          pageSize: params.pageSize
        }
      });
    }, 500);
  });
};

// 创建用户
export const createUser = (user: User): Promise<{ data: User }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        ...user,
        id: Math.floor(Math.random() * 10000) + 1000,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };

      // 添加到模拟数据
      mockUserList.unshift(newUser);

      resolve({ data: newUser });
    }, 500);
  });
};

// 更新用户
export const updateUser = (user: User): Promise<{ data: User }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUserList.findIndex((item) => item.id === user.id);

      if (index !== -1) {
        const updatedUser = {
          ...mockUserList[index],
          ...user,
          updateTime: new Date().toISOString()
        };

        mockUserList.splice(index, 1, updatedUser);
        resolve({ data: updatedUser });
      } else {
        throw new Error('用户不存在');
      }
    }, 500);
  });
};

// 删除用户
export const deleteUser = (id: number): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUserList.findIndex((item) => item.id === id);

      if (index !== -1) {
        mockUserList.splice(index, 1);
        resolve({ success: true });
      } else {
        throw new Error('用户不存在');
      }
    }, 500);
  });
};
