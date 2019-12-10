import request from '@/utils/request'


export function filterEvidence(data) {
    return request({
        url: '/v1/cp/filter_evidence/',
        method: 'post',
        data
    })
}

