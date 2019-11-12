import request from '@/utils/request'

export function fetchLinksList(query) {
  return request({
    url: '/v1/cp/friend_links/',
    method: 'get',
    params: query
  })
}

export function fetchLinks(id) {
  return request({
    url: '/v1/cp/friend_links/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createLinks(data) {
  return request({
    url: '/v1/cp/friend_links/new/',
    method: 'post',
    data
  })
}

export function updateLinks(data) {
  return request({
    url: '/v1/cp/friend_links/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delLinks(data) {
  return request({
    url: '/v1/cp/friend_links/',
    method: 'post',
    data
  })
}
