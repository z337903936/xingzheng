import request from '@/utils/request'

export function fetchMembersList(query) {
  return request({
    url: '/v1/cp/members/',
    method: 'get',
    params: query
  })
}

export function fetchMembers(id) {
  return request({
    url: '/v1/cp/members/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function lockMembers(data) {
  return request({
    url: '/v1/cp/members/status/',
    method: 'post',
    data
  })
}

export function membersDeposit(data) {
  return request({
    url: '/v1/cp/deposit/new/',
    method: 'post',
    data
  })
}

export function cashDeposit(data) {
  return request({
    url: '/v1/cp/cash_deposit/new/',
    method: 'post',
    data
  })
}
