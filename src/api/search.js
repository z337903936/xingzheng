import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/v1/cp/evidence_list/',
        method: 'post',
        data
    })
}

export function createArticle(data) {
    return request({
        url: '/v1/cp/evidence/new/',
        method: 'post',
        data
    })
}

// export function updateArticle(data) {
//     return request({
//         url: '/v1/cp/articles/' + data.id + '/',
//         method: 'post',
//         data
//     })
// }
// export function delArticle(data) {
//     return request({
//         url: '/v1/cp/article/',
//         method: 'post',
//         data
//     })
// }
