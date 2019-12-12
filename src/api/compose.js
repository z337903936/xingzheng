import request from '@/utils/request'

export function composeList(data) {
    return request({
        url: '/v1/cp/compose_tasks/',
        method: 'get',
        params: data
    })
}

export function auditComposeList() {
    return request({
        url: '/v1/cp/compose_tasks_to_audit/',
        method: 'get',
        params: {}
    })
}


export function applyCompose(data) {
    return request({
        url: '/v1/cp/apply_compose_task/',
        method: 'post',
        data
    })
}



export function auditCompose(data) {
    return request({
        url: '/v1/cp/audit_compose_task/',
        method: 'post',
        data
    })
}

