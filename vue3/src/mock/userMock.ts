import type { User } from '../types/user'

// 生成随机日期
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// 模拟用户数据
export const mockUserList: User[] = [
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    status: 1,
    createTime: '2023-01-01T00:00:00Z',
    updateTime: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13900139001',
    role: 'user',
    status: 1,
    createTime: '2023-02-15T10:30:00Z',
    updateTime: '2023-02-15T10:30:00Z'
  },
  {
    id: 3,
    username: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    phone: '13900139002',
    role: 'user',
    status: 1,
    createTime: '2023-03-20T14:20:00Z',
    updateTime: '2023-03-20T14:20:00Z'
  },
  {
    id: 4,
    username: 'user3',
    name: '王五',
    email: 'wangwu@example.com',
    phone: '13900139003',
    role: 'user',
    status: 0, // 禁用状态
    createTime: '2023-04-10T09:15:00Z',
    updateTime: '2023-04-10T09:15:00Z'
  },
  {
    id: 5,
    username: 'user4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    phone: '13900139004',
    role: 'user',
    status: 1,
    createTime: '2023-05-05T16:45:00Z',
    updateTime: '2023-05-05T16:45:00Z'
  },
  {
    id: 6,
    username: 'user5',
    name: '钱七',
    email: 'qianqi@example.com',
    phone: '13900139005',
    role: 'user',
    status: 1,
    createTime: '2023-06-12T11:20:00Z',
    updateTime: '2023-06-12T11:20:00Z'
  },
  {
    id: 7,
    username: 'user6',
    name: '孙八',
    email: 'sunba@example.com',
    phone: '13900139006',
    role: 'user',
    status: 1,
    createTime: '2023-07-18T13:10:00Z',
    updateTime: '2023-07-18T13:10:00Z'
  },
  {
    id: 8,
    username: 'user7',
    name: '周九',
    email: 'zhoujiu@example.com',
    phone: '13900139007',
    role: 'user',
    status: 1,
    createTime: '2023-08-22T15:30:00Z',
    updateTime: '2023-08-22T15:30:00Z'
  },
  {
    id: 9,
    username: 'user8',
    name: '吴十',
    email: 'wushi@example.com',
    phone: '13900139008',
    role: 'user',
    status: 0, // 禁用状态
    createTime: '2023-09-05T10:45:00Z',
    updateTime: '2023-09-05T10:45:00Z'
  },
  {
    id: 10,
    username: 'user9',
    name: '郑十一',
    email: 'zhengshiyi@example.com',
    phone: '13900139009',
    role: 'user',
    status: 1,
    createTime: '2023-10-11T14:20:00Z',
    updateTime: '2023-10-11T14:20:00Z'
  }
];

// 生成更多测试数据（如果需要）
for (let i = 11; i <= 50; i++) {
  const roles: ('admin' | 'user')[] = ['user', 'admin'];
  const statuses: (0 | 1)[] = [0, 1];

  mockUserList.push({
    id: i,
    username: `testuser${i}`,
    name: `测试用户${i}`,
    email: `test${i}@example.com`,
    phone: `139${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: roles[Math.floor(Math.random() * roles.length)] as 'admin' | 'user',
    status: statuses[Math.floor(Math.random() * statuses.length)] as 0 | 1,
    createTime: randomDate(new Date(2023, 0, 1), new Date()),
    updateTime: randomDate(new Date(2023, 0, 1), new Date())
  });
}
