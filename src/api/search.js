import request from '@/utils/request'

export function fetchList(data) {
    return request({
        url: '/v1/cp/evidence_list/',
        method: 'post',
        data
    })
}


export function fetchSearch(id) {
    return request({
        url: '/v1/cp/evidence/' + id + '/',
        method: 'get',
        params: {}
    })
}


export function createSearch(data) {
    return request({
        url: '/v1/cp/evidence/new/',
        method: 'post',
        data
    })
}

export function updateSearch(data) {
    return request({
        url: '/v1/cp/evidence/' + data.id + '/',
        method: 'post',
        data
    })
}
//当事人
export function createPerson(data) {
    return request({
        url: '/v1/cp/evidence_concerned_person/new/',
        method: 'post',
        data
    })
}

export function updatePerson(data) {
    return request({
        url: '/v1/cp/evidence_concerned_person/' + data.id + '/',
        method: 'post',
        data
    })
}

export function delPerson(data) {
    return request({
        url: '/v1/cp/evidence_concerned_person/',
        method: 'post',
        data
    })
}

//损失
export function createLost(data) {
    return request({
        url: '/v1/cp/evidence_lost_detail/new/',
        method: 'post',
        data
    })
}

export function updateLost(data) {
    return request({
        url: '/v1/cp/evidence_lost_detail/' + data.id + '/',
        method: 'post',
        data
    })
}

export function delLost(data) {
    return request({
        url: '/v1/cp/evidence_lost_detail/',
        method: 'post',
        data
    })
}

//物证
export function createMaterial(data) {
    return request({
        url: '/v1/cp/evidence_material/new/',
        method: 'post',
        data
    })
}

export function updateMaterial(data) {
    return request({
        url: '/v1/cp/evidence_material/' + data.id + '/',
        method: 'post',
        data
    })
}

export function delMaterial(data) {
    return request({
        url: '/v1/cp/evidence_material/',
        method: 'post',
        data
    })
}

//文书
export function createDocument(data) {
    return request({
        url: '/v1/cp/evidence_document/new/',
        method: 'post',
        data
    })
}

export function updateDocument(data) {
    return request({
        url: '/v1/cp/evidence_document/' + data.id + '/',
        method: 'post',
        data
    })
}

export function delDocument(data) {
    return request({
        url: '/v1/cp/evidence_document/',
        method: 'post',
        data
    })
}