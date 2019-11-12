import request from '@/utils/request'

export function fetchJobList(query) {
  return request({
    url: '/v1/cp/jobs/',
    method: 'get',
    params: query
  })
}

export function fetchJob(id) {
  return request({
    url: '/v1/cp/jobs/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function addJob(data) {
  return request({
    url: '/v1/cp/jobs/new/',
    method: 'post',
    data
  })
}

export function updateJob(data) {
  return request({
    url: '/v1/cp/jobs/' + data.id + '/',
    method: 'post',
    data
  })
}

export function delJob(data) {
  return request({
    url: '/v1/cp/jobs/',
    method: 'post',
    data
  })
}
