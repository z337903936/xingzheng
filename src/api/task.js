import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/v1/cp/crime_case_list/',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id) {
    return request({
        url: '/v1/cp/crime_case/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createArticle(data) {
    return request({
        url: '/v1/cp/crime_case/new/',
        method: 'post',
        data
    })
}

export function updateArticle(data) {
    return request({
        url: '/v1/cp/crime_case/' + data.id + '/',
        method: 'post',
        data
    })
}
export function nextTask(data) {
    return request({
        url: '/v1/cp/case_tep/new/',
        method: 'post',
        data
    })
}


export function groupList(query) {
    return request({
        url: '/v1/cp/groups/',
        method: 'get',
        params: query
    })
}




