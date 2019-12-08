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
        url: '/v1/cp/material/new/',
        method: 'post',
        data
    })
}

export function updateMaterial(data) {
    return request({
        url: '/v1/cp/material/' + data.id + '/',
        method: 'post',
        data
    })
}

export function applyDelMaterial(data) {
    return request({
        url: '/v1/cp/apply_destroy_material/',
        method: 'post',
        data
    })
}


export function delMaterialList(data) {
    return request({
        url: '/v1/cp/apply_destroy_material_list/',
        method: 'post',
        data
    })
}

export function delMaterialAction(data) {
    return request({
        url: '/v1/cp/handle_apply_destroy_material/',
        method: 'post',
        data
    })
}
