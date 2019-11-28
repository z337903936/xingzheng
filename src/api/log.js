import request from '@/utils/request'

export function logList(query) {
    return request({
        url: '/v1/cp/operation_logs/',
        method: 'get',
        params: query
    })
}