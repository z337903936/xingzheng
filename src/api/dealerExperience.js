import request from '@/utils/request'

export function fetchDealerSubmitLogs(query) {
  return request({
    url: '/v1/cp/dealer_submit_logs/',
    method: 'get',
    params: query
  })
}

export function fetchExperienceLogs(query) {
  return request({
    url: '/v1/cp/xp_logs/',
    method: 'get',
    params: query
  })
}

export function setDealerSubmitLogStatus(data) {
  return request({
    url: '/v1/cp/dealer_submit_logs/',
    method: 'post',
    data
  })
}

export function setExperienceLogStatus(data) {
  return request({
    url: '/v1/cp/xp_logs/',
    method: 'post',
    data
  })
}
