import request from '@/utils/request'

export function fetchPartnerList(query) {
  return request({
    url: '/v1/cp/partner_ship/',
    method: 'get',
    params: query
  })
}

export function fetchPartner(id) {
  return request({
    url: '/v1/cp/partner_ship/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createPartner(data) {
  return request({
    url: '/v1/cp/partner_ship/new/',
    method: 'post',
    data
  })
}

export function updatePartner(data) {
  return request({
    url: '/v1/cp/partner_ship/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delPartner(data) {
  return request({
    url: '/v1/cp/partner_ship/',
    method: 'post',
    data
  })
}
