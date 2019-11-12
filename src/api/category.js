import request from '@/utils/request'

export function fetchCateList(query) {
  return request({
    url: '/v1/cp/categories/',
    method: 'get',
    params: query
  })
}

export function fetchAllCateList() {
  return request({
    url: '/v1/cp/all_categories/',
    method: 'get'
  })
}

export function fetchCategory(id) {
  return request({
    url: '/v1/cp/categories/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function addCarousel(data) {
  return request({
    url: '/v1/cp/categories/new/',
    method: 'post',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/v1/cp/categories/' + data.id + '/',
    method: 'post',
    data
  })
}

export function delCategory(data) {
  return request({
    url: '/v1/cp/category/',
    method: 'post',
    data
  })
}
