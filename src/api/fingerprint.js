import request from '@/utils/request'

export function fpList(data) {
    return request({
        url: '/v1/cp/fp_record_list/',
        method: 'post',
        data
    })
}

export function fetchFp(id) {
    return request({
        url: '/v1/cp/fp_record/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createFp(data) {
    return request({
        url: '/v1/cp/fp_record/new/',
        method: 'post',
        data
    })
}

export function updateFp(data) {
    return request({
        url: '/v1/cp/fp_record/' + data.id + '/',
        method: 'post',
        data
    })
}
