import request from '@/utils/request'

export function listTemplate(query) {
  return request({
    url: '/v1/cp/templates/',
    method: 'get',
    params: query
  })
}

export function fetchTemplate(id) {
  return request({
    url: '/v1/cp/templates/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function saveTemplate(data) {
  return request({
    url: '/v1/cp/templates/',
    method: 'post',
    data
  })
}

export function setTemplateStatus(data) {
  return request({
    url: '/v1/cp/templates/status/',
    method: 'post',
    data
  })
}

export function copyTemplate(data) {
  return request({
    url: '/v1/cp/copy_template/',
    method: 'post',
    data
  })
}

export function submitTemplate(data) {
  return request({
    url: '/v1/cp/submit_template/',
    method: 'post',
    data
  })
}

export function addRmsRes(data) {
  return request({
    url: '/v1/cp/rms_res/new/',
    method: 'post',
    data
  })
}

export function listRmsRes(data) {
  return request({
    url: '/v1/cp/rms_res/',
    method: 'post',
    data
  })
}

export function addTemplate(data) {
  return request({
    url: '/v1/cp/templates/',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/v1/cp/templates/' + data.id + '/',
    method: 'post',
    data
  })
}

export function sendByTemplate(data) {
  return request({
    url: '/v1/cp/send_rms_by_template/',
    method: 'post',
    data
  })
}
