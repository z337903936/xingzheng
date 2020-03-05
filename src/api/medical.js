import request from '@/utils/request'

export function fetchMedicalList(data) {
  return request({
    url: '/v1/cp/medical_record_list/',
    method: 'post',
    data
  })
}

export function fetchMedical(id) {
  return request({
    url: '/v1/cp/medical_record/' + id + '/',
    method: 'get',
    params: {}
  })
}

export function createMedical(data) {
  return request({
    url: '/v1/cp/medical_record/new/',
    method: 'post',
    data
  })
}

export function updateMedical(data) {
  return request({
    url: '/v1/cp/medical_record/' + data.id + '/',
    method: 'post',
    data
  })
}

