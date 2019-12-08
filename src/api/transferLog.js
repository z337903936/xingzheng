import request from '@/utils/request'

export function transferList(data) {
    return request({
        url: '/v1/cp/material_transfer_log/',
        method: 'post',
         data
    })
}
