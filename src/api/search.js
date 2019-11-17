import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/v1/cp/evidence_list/',
        method: 'post',
        data
    })
}


export function fetchArticle(id) {
    return request({
        url: '/v1/cp/evidence/' + id + '/',
        method: 'get',
        params: {}
    })
}


export function createArticle(data) {
    return request({
        url: '/v1/cp/evidence/new/',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/v1/cp/evidence/' + data.id + '/',
        method: 'post',
        data
    })
}
// export function delArticle(data) {
//     return request({
//         url: '/v1/cp/evidence/',
//         method: 'post',
//         data
//     })
// }
