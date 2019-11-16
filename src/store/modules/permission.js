import { asyncRouterMap, constantRouterMap } from '@/router'
import { fetchList } from '@/api/menu'
import { getUserMenuInfo } from '@/api/login'
/* Layout */
import Layout from '@/views/layout/Layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function changeAsyncRouter(asyncRouterMap) {
  const routers = asyncRouterMap.map(route => {
    var sendData = {
      path: route.path,
      redirect: route.redirect,
      name: route.name,
      meta: {
        title: route.meta.title,
        icon: route.meta.icon,
        noCache: route.meta.noCache
      }
    }
    if (route.component) {
      if (route.component === 'Layout') {
        sendData.component = Layout
      } else {
        sendData.component = () => import(route.component) // 导入组件
      }
    }
    if (route.children && route.children.length) {
      sendData.children = route.children.map(child => {
        var sendChild = {
          path: child.path,
          name: child.name,
          hidden: child.hidden,
          meta: { title: child.meta.title, icon: child.meta.icon }
        }

        if (child.component === 'Layout') {
          sendChild.component = Layout
        } else {
          sendChild.component = () => import(`@/views${child.component}`) // 导入组件
        }

        return sendChild
      })
    }

    return sendData
  })

  return routers
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve, reject) => {
        // const {roles} = data
        // let accessedRouters
        // if (roles.includes('admin')) {
        //     accessedRouters = asyncRouterMap
        // } else {
        //     accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        // commit('SET_ROUTERS', accessedRouters)
        getUserMenuInfo().then(data2 => {
          if (data2.code !== 200) {
            reject(data2)
          } else {
            const menus = changeAsyncRouter(data2.list)
            commit('SET_ROUTERS', menus)
            resolve(menus)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default permission
