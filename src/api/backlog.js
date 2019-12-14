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
        url: '/v1/cp/task/',
        method: 'post',
        data
    })
}

export function medicalDetail(data) {
    return request({
        url: '/v1/cp/case_details/',
        method: 'get',
        params:data
    })
}


export function writeResult(data) {
    return request({
        url: '/v1/cp/exam_task_result/?materialId=' + data.id ,
        method: 'post',
        data
    })
}
export function medicalWriteResult(data) {
    return request({
        url: '/v1/cp/evidence_medical_record_list/',
        method: 'post',
        data
    })
}
export function cancelEvidence(data) {
    return request({
        url: '/v1/cp/cancel_evidence/',
        method: 'post',
        data
    })
}
