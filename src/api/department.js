import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/v1/cp/orgs/',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id) {
    return request({
        url: '/v1/cp/dict/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createArticle(data) {
    return request({
        url: '/v1/cp/org/new/',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/v1/cp/org/' + data.id + '/',
        method: 'post',
        data
    })
}
export function delArticle(data) {
    return request({
        url: '/v1/cp/org/',
        method: 'post',
        data
    })
}

export function setUser(data) {
    return request({
        url: '/v1/cp/batch_update_org_member/'+ data.uid + '/',
        method: 'post',
        data
    })
}
export function getUser(query) {
    return request({
        url: '/v1/cp/org_members/',
        method: 'get',
        params: query
    })
}
