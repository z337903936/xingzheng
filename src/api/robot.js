import request from '@/utils/request'

export function robotList(data) {
    return request({
        url: '/v1/cp/task_list/',
        method: 'post',
        data
    })
}

export function createRobot(data) {
    return request({
        url: '/v1/cp/tasks/new/',
        method: 'post',
        data
    })
}

export function updateRobot(data) {
    return request({
        url: '/v1/cp/tasks/' + data.id + '/',
        method: 'post',
        data
    })
}


export function startRobot(data) {
    return request({
        url: '/v1/cp/start_task/',
        method: 'post',
         data
    })
}


export function endRobot(data) {
    return request({
        url: '/v1/cp/end_task/',
        method: 'post',
         data
    })
}


export function robotBatch(data) {
    return request({
        url: '/v1/cp/task_batch/' + data.id + '/',
        method: 'get',
        params: data
    })
}


export function robotResult(data){
    return request({
        url: '/v1/cp/batch_result/' + data.id + '/',
        method: 'get',
        params: data
    })
}
