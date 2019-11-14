import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v1/cp/menu/',
    method: 'get',
    params: query
  })
}

export function fetchMenu(id) {
  return request({
    url: '/v1/cp/menu/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createMenu(data) {
  return request({
    url: '/v1/cp/menu/new/',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/v1/cp/menu/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delMenu(data) {
  return request({
    url: '/v1/cp/menu/',
    method: 'post',
    data
  })
}
