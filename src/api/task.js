import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/v1/cp/crime_case_list/',
        method: 'get',
        params: query
    })
}

export function fetchTask(id) {
    return request({
        url: '/v1/cp/crime_case/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createTask(data) {
    return request({
        url: '/v1/cp/crime_case/new/',
        method: 'post',
        data
    })
}

export function updateTask(data) {
    return request({
        url: '/v1/cp/crime_case/' + data.id + '/',
        method: 'post',
        data
    })
}

export function taskList(query) {
    return request({
        url: '/v1/cp/group_case_step_list/',
        method: 'get',
        params: query
    })
}

export function nextTask(data) {
    return request({
        url: '/v1/cp/case_step/new/',
        method: 'post',
        data
    })
}

export function accetpTask(data) {
    return request({
        url: '/v1/cp/case_step/' + data.id + '/',
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




