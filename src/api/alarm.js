import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/v1/cp/report_list/',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/v1/cp/report_list/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createArticle(data) {
  return request({
    url: '/v1/cp/report/new/',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/v1/cp/report/' + data.id + '/',
    method: 'post',
    data
  })
}

