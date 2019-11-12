import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/v1/cp/carousels/',
    method: 'get',
    params: query
  })
}

export function fetchCarousel(id) {
  return request({
    url: '/v1/cp/carousels/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createCarousel(data) {
  return request({
    url: '/v1/cp/carousels/new/',
    method: 'post',
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: '/v1/cp/carousels/' + data.id + '/',
    method: 'post',
    data
  })
}
export function deleteCarousel(data) {
  return request({
    url: '/v1/cp/carousels/',
    method: 'post',
    data
  })
}
