import request from '@/utils/request'

export function fetchRoleList(query) {
  return request({
    url: '/v1/cp/groups/',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: '/v1/cp/groups/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createRole(data) {
  return request({
    url: '/v1/cp/group/new/',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/v1/cp/group/' + data.id + '/',
    method: 'post',
    data
  })
}

export function delRole(data) {
  return request({
    url: '/v1/cp/group/',
    method: 'post',
    data
  })
}

export function fetchActionList(query) {
  return request({
    url: '/v1/cp/actions/',
    method: 'get',
    params: query
  })
}

export function fetchAction(id) {
  return request({
    url: '/v1/cp/action/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createAction(data) {
  return request({
    url: '/v1/cp/action/new/',
    method: 'post',
    data
  })
}

export function updateAction(data) {
  return request({
    url: '/v1/cp/action/' + data.id + '/',
    method: 'post',
    data
  })
}

export function delAction(data) {
  return request({
    url: '/v1/cp/action/',
    method: 'post',
    data
  })
}

export function getRoleActionByRoleId(id) {
  return request({
    url: '/v1/cp/actions_by_filter/' + id + '/',
    method: 'get'
  })
}

export function fetchAdminMemberList(query) {
  return request({
    url: '/v1/cp/admin_members/',
    method: 'get',
    params: query
  })
}

export function fetchAdminMember(uid) {
  return request({
    url: '/v1/cp/admin_members/' + uid + '/',
    method: 'get',
    params: {}
  })
}

export function createAdminMember(data) {
  return request({
    url: '/v1/cp/admin_member/new/',
    method: 'post',
    data
  })
}

export function updateAdminMember(data) {
  return request({
    url: '/v1/cp/admin_member/' + data.id + '/',
    method: 'post',
    data
  })
}

export function delAdminMember(data) {
  return request({
    url: '/v1/cp/admin_member/',
    method: 'post',
    data
  })
}

export function addGroupUser(data) {
  return request({
    url: '/v1/cp/group_user/new/',
    method: 'post',
    data
  })
}

export function delGroupUser(data) {
  return request({
    url: '/v1/cp/group_user/',
    method: 'post',
    data
  })
}

export function listUsersByGroupId(groupId) {
  return request({
    url: '/v1/cp/group_user/' + groupId + '/',
    method: 'get'
  })
}

export function updateGroupAction(data) {
  return request({
    url: '/v1/cp/group_action/',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/v1/cp/admin_member_password/',
    method: 'post',
    data
  })
}
