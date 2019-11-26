import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v1/cp/param_config/',
    method: 'get',
    params: query
  })
}

export function fetchInfo(id) {
  return request({
    url: '/v1/cp/param_config/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createInfo(data) {
  return request({
    url: '/v1/cp/param_config/new/',
    method: 'post',
    data
  })
}

export function updateInfo(data) {
  return request({
    url: '/v1/cp/param_config/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delInfo(data) {
  return request({
    url: '/v1/cp/param_config/',
    method: 'post',
    data
  })
}
