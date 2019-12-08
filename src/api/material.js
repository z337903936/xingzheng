import request from '@/utils/request'

export function fetchMaterialList(data) {
    return request({
        url: '/v1/cp/materials/',
        method: 'post',
        data
    })
}

export function fetchMaterial(id) {
    return request({
        url: '/v1/cp/materials/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createMaterial(data) {
    return request({
        url: '/v1/cp/materials/new/',
        method: 'post',
        data
    })
}

export function updateMaterial(data) {
    return request({
        url: '/v1/cp/materials/' + data.id + '/',
        method: 'post',
        data
    })
}
export function delMaterial(data) {
    return request({
        url: '/v1/cp/materials/',
        method: 'post',
        data
    })
}
