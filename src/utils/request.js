import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken, getUID } from '@/utils/auth'
import md5 from 'js-md5'

// create an axios instance
const service = axios.create({
  baseURL: '',
  // baseURL: destHost, // api 的 base_url
  timeout: 5000 // request timeout,
})
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      const token = getToken()
      config.headers['X-AUTH-TOKEN-UID'] = getUID()
      if (config.url.indexOf('/v1/cp/') > -1) {
        var timestamp = Date.parse(new Date()) / 1000
        var salt = 'http://starnew.cn/detect/'
        var s = md5(token + md5(token + salt + timestamp))
        if (!config.params)config.params = {}
        config.params.t = timestamp
        config.params.s = s
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response.data,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res.code) {
      if (res.code !== 200) {
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (res.code === 403) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        } else {
          Message({
            message: res.reason,
            type: 'error',
            duration: 5 * 1000
          })
        }
        // return Promise.reject(res)
      } else {
        return response.data
      }
    }else{
      return response.data
    }

  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.reason,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
