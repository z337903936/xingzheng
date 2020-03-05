import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, getUID, setUID, removeUID } from '@/utils/auth'
import { fetchList } from '@/api/paramConfig'
import { taskList } from '@/api/backlog'
import { userDictList, userUseDict, delUserUseDict } from '@/api/dictionary'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    uid: getUID(),
    id: '',
    groupName: '',
    name: '',
    avatar: '',
    introduction: '',
    caseNo: '',
    instanceNo: '',
    evidenceNo: '',
    roles: [],
    orgName: '',
    webName: '',
    userName: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_ORGNAME: (state, orgName) => {
      state.orgName = orgName
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_WEBNAME: (state, webName) => {
      state.webName = webName
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_CASE: (state, caseNo) => {
      state.caseNo = caseNo
    },
    SET_INSTANCE: (state, instanceNo) => {
      state.instanceNo = instanceNo
    },
    SET_EVIDENCE: (state, evidenceNo) => {
      state.evidenceNo = evidenceNo
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_GROUPNAME: (state, groupName) => {
      state.groupName = groupName
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.vcode).then(data => {
          if (data.code !== 200) {
            reject(data)
          } else {
            commit('SET_TOKEN', data.token)
            commit('SET_UID', data.uid)

            setToken(data.token)
            setUID(data.uid)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(data => {
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('获取用户岗位出错啦!')
          }
          commit('SET_GROUPNAME', data.groupName)
          commit('SET_USERNAME', data.userName)
          commit('SET_NAME', data.name)
          commit('SET_ID', data.id)
          if (!data.avatar) data.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetSystemParam({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetchList().then(response => {
          response.list.map(data => {
            if (data.key === 'CASE_NO_PREFIX') { commit('SET_CASE', data.value) }

            if (data.key === 'INSTANCE_NO_PREFIX') { commit('SET_INSTANCE', data.value) }

            if (data.key === 'EVIDENCE_NO_PREFIX') { commit('SET_EVIDENCE', data.value) }
            if (data.key === 'PARAM_KEY_TITLE') { commit('SET_WEBNAME', data.value) }
            if (data.key === 'PARAM_KEY_ORG_NAME') { commit('SET_ORGNAME', data.value) }
          })
        })
      })
    },

    PostUserUseDict({ commit, state }, dict) {
      return new Promise((resolve, reject) => {
        userUseDict(dict).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    Backlog({ commit, state }) {
      return new Promise((resolve, reject) => {
        const data = {
          status: 1
        }
        taskList(data).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_UID', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_UID', '')
        removeToken()
        removeUID()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(data => {
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
