import request from '@/utils/request'

export function listReg(query) {
  return request({
    url: '/v1/cp/reg_stat/',
    method: 'get',
    params: query
  })
}

export function listUserDaySendStat(query) {
  return request({
    url: '/v1/cp/user_day_send_stat/',
    method: 'get',
    params: query
  })
}

export function listUserMonthSendStat(query) {
  return request({
    url: '/v1/cp/user_month_send_stat/',
    method: 'get',
    params: query
  })
}

export function listUserTotalSendStat(query) {
  return request({
    url: '/v1/cp/user_send_total_stat/',
    method: 'get',
    params: query
  })
}

export function listPlatformDaySendStat(query) {
  return request({
    url: '/v1/cp/platform_day_send_stat/',
    method: 'get',
    params: query
  })
}

export function listPlatformMonthSendStat(query) {
  return request({
    url: '/v1/cp/platform_month_send_stat/',
    method: 'get',
    params: query
  })
}

export function listPlatformTotalSendStat(query) {
  return request({
    url: '/v1/cp/platform_total_send_stat/',
    method: 'get',
    params: query
  })
}

export function listRMSBatchSendResult(data) {
  return request({
    url: '/v1/cp/rms_batch_send_result/',
    method: 'post',
    data
  })
}

export function listRMSSendResultDetail(data) {
  return request({
    url: '/v1/cp/rms_send_result_detail/',
    method: 'post',
    data
  })
}

export function listSMSBatchSendResult(data) {
  return request({
    url: '/v1/cp/sms_batch_send_result/',
    method: 'post',
    data
  })
}

export function listSMSSendResultDetail(data) {
  return request({
    url: '/v1/cp/sms_send_result_detail/',
    method: 'post',
    data
  })
}
