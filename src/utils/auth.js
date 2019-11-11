import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UIDKey = 'Admin-UID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUID() {
  return Cookies.get(UIDKey)
}

export function setUID(uid) {
  return Cookies.set(UIDKey, uid)
}

export function removeUID() {
  return Cookies.remove(UIDKey)
}
