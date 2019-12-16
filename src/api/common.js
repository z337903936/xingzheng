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


export function homePageState(data){
    return request({
        url: '/v1/cp/home_page_stat/',
        method: 'get',
        params: data
    })
}

export function batchPush(data) {
    return request({
        url: '/v1/cp/push_exam_result_to_evidence/',
        method: 'post',
        data
    })
}
