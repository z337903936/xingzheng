import request from '@/utils/request'

export function taskList(query) {
    return request({
        url: '/v1/cp/group_case_step_list/',
        method: 'get',
        params: query
    })
}



export function accetpTask(data) {
    return request({
        url: '/v1/cp/task/' + data.id + '/',
        method: 'post',
        data
    })
}
