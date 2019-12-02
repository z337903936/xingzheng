import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/v1/cp/dict/',
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
        url: '/v1/cp/dict/new/',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/v1/cp/dict/' + data.id + '/',
        method: 'post',
        data
    })
}
export function delArticle(data) {
    return request({
        url: '/v1/cp/dict/',
        method: 'post',
        data
    })
}


export function userDictList(query) {
    return request({
        url: '/v1/cp/user_dict_list/',
        method: 'get',
        params: query
    })
}

export function userUseDict(data) {
    return request({
        url: '/v1/cp/user_dict/new/',
        method: 'post',
        data
    })
}


export function delUserUseDict(data) {
    return request({
        url: '/v1/cp/user_dict/',
        method: 'post',
        data
    })
}


