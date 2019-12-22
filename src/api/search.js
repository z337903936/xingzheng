import request from '@/utils/request'

export function exportExcelAlone(id) {
    return request({
        url: '/v1/cp/export_evidence/'+id+'/',
        method: 'get',
        params: {}
    })
}
export function searchList(data) {
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

export function submitMaterial(data) {
    return request({
        url: '/v1/cp/batch_submit_material/',
        method: 'post',
        data
    })
}

export function submitMaterialOutStock(data) {
    return request({
        url: '/v1/cp/batch_apply_material_out_stock/',
        method: 'post',
        data
    })
}
export function submitMaterialinStock(data) {
    return request({
        url: '/v1/cp/batch_apply_material_in_stock/',
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

//嫌疑人

export function createSuspect(data) {
    return request({
        url: '/v1/cp/evidence_suspect_person/new/',
        method: 'post',
        data
    })
}

export function updateSuspect(data) {
    return request({
        url: '/v1/cp/evidence_suspect_person/' + data.id + '/',
        method: 'post',
        data
    })
}

export function delSuspect(data) {
    return request({
        url: '/v1/cp/evidence_suspect_person/',
        method: 'post',
        data
    })
}
//三录

export function createSanlu(data) {
    return request({
        url: '/v1/cp/evidence_sanlu/new/',
        method: 'post',
        data
    })
}


export function delSanlu(data) {
    return request({
        url: '/v1/cp/evidence_sanlu/',
        method: 'post',
        data
    })
}
export function submitSanlu(data) {
    return request({
        url: '/v1/cp/batch_submit_sanlu/',
        method: 'post',
        data
    })
}
export function submitTaskNo(data) {
    return request({
        url: '/v1/cp/evidence_exam_task_no/',
        method: 'post',
        data
    })
}
