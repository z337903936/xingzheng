import request from '@/utils/request'

export function dnaList(data) {
    return request({
        url: '/v1/cp/dna_record_list/',
        method: 'post',
        data
    })
}

export function fetchDna(id) {
    return request({
        url: '/v1/cp/dna_record/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createDna(data) {
    return request({
        url: '/v1/cp/dna_record/new/',
        method: 'post',
        data
    })
}

export function updateDna(data) {
    return request({
        url: '/v1/cp/dna_record/' + data.id + '/',
        method: 'post',
        data
    })
}
