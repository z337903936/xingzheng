import request from '@/utils/request'


export function fetchForumList(query) {
    return request({
        url: '/v1/cp/articles/',
        method: 'get',
        params: query
    })
}


export function fetchForum(id) {
    return request({
        url: '/v1/cp/articles/' + id + '/',
        method: 'get',
        params: {}
    })
}

export function createForum(data) {
    return request({
        url: '/v1/cp/articles/new/',
        method: 'post',
        data
    })
}

export function updateForum(data) {
    return request({
        url: '/v1/cp/articles/' + data.id + '/',
        method: 'post',
        data
    })
}
export function delForum(data) {
    return request({
        url: '/v1/cp/articles/',
        method: 'post',
        data
    })
}

export function favForum(data) {
    return request({
        url: '/v1/cp/n/article_fav/',
        method: 'post',
        data
    })
}


export function fetchForumCommentsList(query) {
    return request({
        url: '/v1/cp/n/article_comments/',
        method: 'get',
        params: query
    })
}
export function commentAction(data) {
    return request({
        url: '/v1/cp/n/article_comment/',
        method: 'post',
        data
    })
}
export function commentLikeAction(data) {
    return request({
        url: '/v1/cp/n/comment_like/',
        method: 'post',
        data
    })
}
export function commentReplyAction(data) {
    return request({
        url: '/v1/cp/n/comment_reply/',
        method: 'post',
        data
    })
}
