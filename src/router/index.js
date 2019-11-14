import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: false

  },
  {
    path: '/change-password/',
    component: () => import('@/views/permissions/changePassword'),
    name: 'ChangePwd',
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/alarm/index'),
        name: 'Alarm',
        meta: { title: '接警查询', icon: 'tab' }
      }
    ]
  }, {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/menu/index'),
        name: 'Menu',
        meta: { title: '菜单管理', icon: 'tab' }
      }

    ]
  },
  {
    path: '/task',
    component: Layout,
    meta: { title: '任务', icon: 'tab' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/task/index'),
        name: 'Task',
        meta: { title: '任务', icon: 'tab' }
      }

    ]
  }

  // {
  //   path: '/permissions',
  //   component: Layout,
  //     redirect: '/permissions/list',
  //   name: 'Permissions',
  //   meta: {
  //     title: '权限管理',
  //     icon: 'drag',
  //     noCache: true
  //   },
  //   children: [
  //     {
  //       path: 'list-admin-member',
  //       component: () => import('@/views/permissions/member/list'),
  //       name: 'MemberList',
  //       meta: { title: '管理员列表', icon: 'list', noCache: true }
  //     },
  //     {
  //       path: 'create-admin-member',
  //       component: () => import('@/views/permissions/member/create'),
  //       name: 'CreateMember',
  //       meta: { title: '添加管理员', icon: 'edit', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'edit-admin-member/:id(\\d+)',
  //       component: () => import('@/views/permissions/member/edit'),
  //       name: 'EditMember',
  //       meta: { title: '编辑管理员', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list-role',
  //       component: () => import('@/views/permissions/role/list'),
  //       name: 'roleList',
  //       meta: { title: '角色列表', icon: 'list', noCache: true }
  //     },
  //     {
  //       path: 'create-role',
  //       component: () => import('@/views/permissions/role/create'),
  //       name: 'CreateRole',
  //       meta: { title: '添加角色', icon: 'edit', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'edit-role/:id(\\d+)',
  //       component: () => import('@/views/permissions/role/edit'),
  //       name: 'EditRole',
  //       meta: { title: '编辑角色', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'set-action/:id',
  //       component: () => import('@/views/permissions/role/setGroupAction'),
  //       name: 'SetGroupAction',
  //       meta: { title: '设置角色权限', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list-action',
  //       component: () => import('@/views/permissions/action/list'),
  //       name: 'actionList',
  //       meta: { title: '权限列表', icon: 'list', noCache: true }
  //     },
  //     {
  //       path: 'create-action',
  //       component: () => import('@/views/permissions/action/create'),
  //       name: 'CreateAction',
  //       meta: { title: '添加权限', icon: 'edit', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'edit-action/:id',
  //       component: () => import('@/views/permissions/action/edit'),
  //       name: 'EditAction',
  //       meta: { title: '编辑权限', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'change-password/',
  //       component: () => import('@/views/permissions/changePassword'),
  //       name: 'ChangePassword',
  //       meta: { title: '修改密码', icon: 'edit', noCache: true },
  //       hidden: false
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
