import request from '@/utils/request'

export function fetchAccountsList(query) {
  return request({
    url: '/v1/cp/api_accounts/',
    method: 'get',
    params: query
  })
}

export function fetchAccounts(id) {
  return request({
    url: '/v1/cp/api_accounts/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createAccounts(data) {
  return request({
    url: '/v1/cp/api_accounts/new/',
    method: 'post',
    data
  })
}

export function updateAccounts(data) {
  return request({
    url: '/v1/cp/api_accounts/' + data.id + '/',
    method: 'post',
    data
  })
}
export function delAccounts(data) {
  return request({
    url: '/v1/cp/api_accounts/',
    method: 'post',
    data
  })
}
