import request from '@/utils/request'

export function fetchDepositLogs(query) {
  return request({
    url: '/v1/cp/deposit_logs/',
    method: 'get',
    params: query
  })
}

export function fetchCashDepositLogs(query) {
  return request({
    url: '/v1/cp/cash_deposit_logs/',
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

