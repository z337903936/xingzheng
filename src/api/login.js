import request from '@/utils/request'

export function loginByUsername(username, password, vcode) {
  const data = {
    'username': username,
    'password': password,
    'vcode': vcode
  }
  return request({
    url: '/v1/cp/login/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/v1/cp/logout/',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/v1/cp/admin_member/info/',
    method: 'get',
    params: { token }
  })
}
export function getUserMenuInfo() {
  return request({
    url: '/v1/cp/member_menu/',
    method: 'get',
    params: {}
  })
}

export function requestSMS(data) {
  return request({
    url: '/v1/user/request_vcode/',
    method: 'post',
    data
  })
}
