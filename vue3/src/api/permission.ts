import request from '@/utils/request';

// Get menu list
export function getMenuList() {
  return request({
    url: '/api/menu/list',
    method: 'get'
  });
}

// Get role list
export function getRoleList(params: any) {
  return request({
    url: '/api/role/list',
    method: 'get',
    params
  });
}

// Add role
export function addRole(data: any) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  });
}

// Update role
export function updateRole(id: number, data: any) {
  return request({
    url: `/api/role/${id}`,
    method: 'put',
    data
  });
}

// Delete role
export function deleteRole(id: number) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete'
  });
}

// Get permission list
export function getPermissionList() {
  return request({
    url: '/api/permission/list',
    method: 'get'
  });
}

// Update role permissions
export function updateRolePermissions(roleId: number, permissionIds: number[]) {
  return request({
    url: `/api/role/${roleId}/permissions`,
    method: 'put',
    data: { permissionIds }
  });
}

// Get user permissions
export function getUserPermissions() {
  return request({
    url: '/api/user/permissions',
    method: 'get'
  });
}
