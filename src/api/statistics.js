import request from '@/utils/request'

export function caseStatistics(query) {
    return request({
        url: '/v1/cp/evidence_stat/',
        method: 'get',
        params: query
    })
}
export function medicalStatistics(query) {
    return request({
        url: '/v1/cp/medical_stat/',
        method: 'get',
        params: query
    })
}
export function crackStatistics(query) {
    return request({
        url: '/v1/cp/crack_stat/',
        method: 'get',
        params: query
    })
}
export function dnaStatistics(query) {
    return request({
        url: '/v1/cp/dna_quality_stat/',
        method: 'get',
        params: query
    })
}
export function evidenceStatistics(query) {
    return request({
        url: '/v1/cp/evidence_quality_stat/',
        method: 'get',
        params: query
    })
}
export function materialStatistics(query) {
    return request({
        url: '/v1/cp/case_spot_material_stat/',
        method: 'get',
        params: query
    })
}
export function stealStatistics(query) {
    return request({
        url: '/v1/cp/steal_rob_material_stat/',
        method: 'get',
        params: query
    })
}

export function analyStatistics(query) {
    return request({
        url: '/v1/cp/dna_quality_analysis_stat/',
        method: 'get',
        params: query
    })
}
