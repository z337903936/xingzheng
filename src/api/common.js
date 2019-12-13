import request from '@/utils/request'

export function batchList(data) {
    return request({
        url: '/v1/cp/exam_batch_list/',
        method: 'post',
         data
    })
}


export function batchMaterialList(data){
    return request({
        url: '/v1/cp/material_list_by_batch/',
        method: 'get',
        params: data
    })
}