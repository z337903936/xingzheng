import request from '@/utils/request'

export function requestSMS() {
  return request({
    url: '/v1/cp/request_sms/',
    method: 'post',
    data:{}
  })
}
