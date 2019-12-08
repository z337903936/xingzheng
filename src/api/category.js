import request from '@/utils/request'


export function fetchAllCateList(query) {
    return request({
        url: '/v1/cp/article_categories/',
        method: 'get',
        params: query
    })
}


export function fetchCategory(id) {
    return request({
        url: '/v1/cp/article_categories/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createCategory(data) {
    return request({
        url: '/v1/cp/article_categories/new/',
        method: 'post',
        data
    })
}

export function updateCategory(data) {
    return request({
        url: '/v1/cp/article_categories/' + data.id + '/',
        method: 'post',
        data
    })
}
export function delCategory(data) {
    return request({
        url: '/v1/cp/article_categories/',
        method: 'post',
        data
    })
}