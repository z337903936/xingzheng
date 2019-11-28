import request from '@/utils/request'

export function alarmList(data) {
  return request({
    url: '/v1/cp/report_list/',
    method: 'post',
    data
  })
}

export function fetchAlarm(id) {
  return request({
    url: '/v1/cp/report_list/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createAlarm(data) {
  return request({
    url: '/v1/cp/report/new/',
    method: 'post',
    data
  })
}

export function updateAlarm(data) {
  return request({
    url: '/v1/cp/report/' + data.id + '/',
    method: 'post',
    data
  })
}

export function deleteAlarm(data) {
  return request({
    url: '/v1/cp/report/',
    method: 'post',
    data
  })
}

