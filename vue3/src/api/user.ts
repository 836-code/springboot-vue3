import request from '@/utils/request';
import ElementPlus from 'element-plus'

// User login
export function login(data: { username: string; password: string }) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
}

// Get user info
export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  });
}

// Logout
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  });
}

// Get user list
export function getUserList(params: any) {
  return request({
    url: '/api/user/list',
    method: 'get',
    params
  });
}

// Add user
export function addUser(data: any) {
  return request({
    url: '/api/user',
    method: 'post',
    data
  });
}

// Update user
export function updateUser(id: number, data: any) {
  return request({
    url: `/api/user/${id}`,
    method: 'put',
    data
  });
}

// Delete user
export function deleteUser(id: number) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  });
}

// Update user status
export function updateUserStatus(id: number, status: number) {
  return request({
    url: `/api/user/status/${id}`,
    method: 'put',
    data: { status }
  });
}
