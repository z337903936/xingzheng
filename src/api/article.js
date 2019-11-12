import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v1/cp/articles/',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/v1/cp/articles/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createArticle(data) {
  return request({
    url: '/v1/cp/articles/new/',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/v1/cp/articles/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delArticle(data) {
  return request({
    url: '/v1/cp/article/',
    method: 'post',
    data
  })
}
