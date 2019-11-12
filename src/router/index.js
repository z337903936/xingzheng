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
    hidden: true
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
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },

  {
    path: '/banner',
    component: Layout,
    redirect: '/banner/list',
    name: 'Banner',
    meta: {
      title: '首页轮播图',
      icon: 'example',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/banner/list'),
        name: 'BannerList',
        meta: { title: '轮播图列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/banner/create'),
        name: 'CreateBanner',
        meta: { title: '添加轮播图', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/banner/edit'),
        name: 'EditBanner',
        meta: { title: '编辑轮播图', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    name: 'Category',
    meta: {
      title: '业务分类',
      icon: 'component',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/category/list'),
        name: 'CategoryList',
        meta: { title: '分类列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/category/create'),
        name: 'CreateCategory',
        meta: { title: '添加分类', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/category/edit'),
        name: 'EditCategory',
        meta: { title: '编辑分类', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: '文章管理',
      icon: 'documentation',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/article/list'),
        name: 'ArticleList',
        meta: { title: '文章列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/article/create'),
        name: 'CreateArticle',
        meta: { title: '添加文章', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/article/edit'),
        name: 'EditArticle',
        meta: { title: '编辑文章', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/members',
    component: Layout,
    redirect: '/members/list',
    name: 'Members',
    meta: {
      title: '会员管理',
      icon: 'user',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/members/list'),
        name: 'MembersList',
        meta: { title: '会员列表', icon: 'list', noCache: true }
      },
      {
        path: 'view/:id(\\d+)',
        component: () => import('@/views/members/view'),
        name: 'ViewMembers',
        meta: { title: '会员详情', noCache: true },
        hidden: true
      },
      {
        path: 'cashDeposit/:id(\\d+)',
        component: () => import('@/views/members/cashDeposit'),
        name: 'CashDeposit',
        meta: { title: '现金充值', noCache: true },
        hidden: true
      },
      {
        path: 'deposit/:id(\\d+)',
        component: () => import('@/views/members/deposit'),
        name: 'DepositMembers',
        meta: { title: '短信充值', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/xp',
    component: Layout,
    redirect: '/experience/list',
    name: 'Experience',
    meta: {
      title: '体验加盟',
      icon: 'form',
      noCache: true
    },
    children: [
      {
        path: 'experienceLogs',
        component: () => import('@/views/experience/experienceLogs'),
        name: 'ExperienceLogs',
        meta: { title: '体验用户列表', icon: 'list', noCache: true }
      },
      {
        path: 'submitLogs',
        component: () => import('@/views/experience/submitLogs'),
        name: 'SubmitLogs',
        meta: { title: '加盟提交列表', icon: 'list', noCache: true }
      }
    ]
  },
  {
    path: '/sendQuery',
    component: Layout,
    redirect: '/send_query/list',
    name: 'SendQuery',
    meta: {
      title: '发送查询',
      icon: 'guide',
      noCache: true
    },
    children: [
      {
        path: 'rmsBatchSendResult',
        component: () => import('@/views/send-query/rmsBatchSendResult'),
        name: 'RMSBatchSendResult',
        meta: { title: '富信批量查询', icon: 'international', noCache: true }
      },
      {
        path: 'rmsSendResultDetail',
        component: () => import('@/views/send-query/rmsBatchSendDetail'),
        name: 'RMSSendResultDetail',
        meta: { title: '富信发送查询', icon: 'international', noCache: true }
      },
      {
        path: 'smsBatchSendResult',
        component: () => import('@/views/send-query/smsBatchSendResult'),
        name: 'SMSBatchSendResult',
        meta: { title: '短信批量查询', icon: 'message', noCache: true }
      },
      {
        path: 'smsSendResultDetail',
        component: () => import('@/views/send-query/smsBatchSendDetail'),
        name: 'SMSSendResultDetail',
        meta: { title: '短信发送查询', icon: 'message', noCache: true }
      }
    ]
  },
  {
    path: '/template',
    component: Layout,
    redirect: '/template/list',
    name: 'Template',
    meta: {
      title: '模板管理',
      icon: 'table',
      noCache: true
    },
    children: [
      {
        path: 'rms-templates',
        component: () => import('@/views/template/rms_template_list'),
        name: 'RmsTemplateList',
        meta: { title: '超级短信模板', icon: 'tree', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/template/create'),
        name: 'CreateTemplate',
        meta: { title: '添加模板', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/template/edit'),
        name: 'EditTemplate',
        meta: { title: '编辑模板', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/list',
    name: 'Finance',
    meta: {
      title: '财务管理',
      icon: 'money',
      noCache: true
    },
    children: [
      {
        path: 'cash-deposit-logs',
        component: () => import('@/views/finance/cashDepositLogs'),
        name: 'CashDepositLogs',
        meta: { title: '现金充值记录', icon: 'money', noCache: true }
      }, {
        path: 'sms-deposit-logs',
        component: () => import('@/views/finance/depositLogs'),
        name: 'DepositLogs',
        meta: { title: '短信充值记录', icon: 'message', noCache: true }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/list',
    name: 'Report',
    meta: {
      title: '报表管理',
      icon: 'chart',
      noCache: true
    },
    children: [
      {
        path: 'regList',
        component: () => import('@/views/stat/regList'),
        name: 'regList',
        meta: { title: '注册日报', icon: 'user', noCache: true }
      }, {
        path: 'userDayStat',
        component: () => import('@/views/stat/userDayStat'),
        name: 'UserDayStat',
        meta: { title: '用户日报', icon: 'user', noCache: true }
      }
      , {
        path: 'userMonthStat',
        component: () => import('@/views/stat/userMonthStat'),
        name: 'UserMonthStat',
        meta: { title: '用户月报', icon: 'user', noCache: true }
      }, {
        path: 'UserTotalStat',
        component: () => import('@/views/stat/userTotalStat'),
        name: 'userTotalStat',
        meta: { title: '用户总报', icon: 'user', noCache: true }
      }, {
        path: 'platformDayStat',
        component: () => import('@/views/stat/platformDayStat'),
        name: 'PlatformDayStat',
        meta: { title: '平台日报', icon: 'dashboard', noCache: true }
      }, {
        path: 'platformMonthStat',
        component: () => import('@/views/stat/platformMonthStat'),
        name: 'PlatformMonthStat',
        meta: { title: '平台月报', icon: 'dashboard', noCache: true }
      }, {
        path: 'platformTotalStat',
        component: () => import('@/views/stat/platformTotalStat'),
        name: 'PlatformTotalStat',
        meta: { title: '平台总报', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/links',
    component: Layout,
    redirect: '/links/list',
    name: 'Links',
    meta: {
      title: '友链管理',
      icon: 'link',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/links/list'),
        name: 'LinksList',
        meta: { title: '友链列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/links/create'),
        name: 'CreateLinks',
        meta: { title: '添加友链', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/links/edit'),
        name: 'EditLinks',
        meta: { title: '编辑友链', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/partner',
    component: Layout,
    redirect: '/partner/list',
    name: 'Partner',
    meta: {
      title: '合作伙伴',
      icon: 'peoples',
      noCache: true
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/partner/list'),
        name: 'PartnerList',
        meta: { title: '合作伙伴列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/partner/create'),
        name: 'CreatePartner',
        meta: { title: '添加合作伙伴', icon: 'edit', noCache: true }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/partner/edit'),
        name: 'EditPartner',
        meta: { title: '编辑合作伙伴', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/api',
    component: Layout,
    redirect: '/api/list',
    name: 'Api',
    meta: {
      title: 'API帐号管理',
      icon: 'star',
      noCache: true
    },
    children: [
      {
        path: 'list-api-accounts',
        component: () => import('@/views/api/accounts/list'),
        name: 'AccountsList',
        meta: { title: 'API账户列表', icon: 'list', noCache: true }
      },
      {
        path: 'create-api-accounts',
        component: () => import('@/views/api/accounts/create'),
        name: 'CreateAccounts',
        meta: { title: '添加API账户', icon: 'edit', noCache: true }
      },
      {
        path: 'edit-api-accounts/:id(\\d+)',
        component: () => import('@/views/api/accounts/edit'),
        name: 'EditAccounts',
        meta: { title: '编辑API账户', noCache: true },
        hidden: true
      }
    ]
  },
  {
    path: '/permissions',
    component: Layout,
    redirect: '/permissions/list',
    name: 'Permissions',
    meta: {
      title: '权限管理',
      icon: 'drag',
      noCache: true
    },
    children: [
      {
        path: 'list-admin-member',
        component: () => import('@/views/permissions/member/list'),
        name: 'MemberList',
        meta: { title: '管理员列表', icon: 'list', noCache: true }
      },
      {
        path: 'create-admin-member',
        component: () => import('@/views/permissions/member/create'),
        name: 'CreateMember',
        meta: { title: '添加管理员', icon: 'edit', noCache: true },
        hidden: true
      },
      {
        path: 'edit-admin-member/:id(\\d+)',
        component: () => import('@/views/permissions/member/edit'),
        name: 'EditMember',
        meta: { title: '编辑管理员', noCache: true },
        hidden: true
      },
      {
        path: 'list-role',
        component: () => import('@/views/permissions/role/list'),
        name: 'roleList',
        meta: { title: '角色列表', icon: 'list', noCache: true }
      },
      {
        path: 'create-role',
        component: () => import('@/views/permissions/role/create'),
        name: 'CreateRole',
        meta: { title: '添加角色', icon: 'edit', noCache: true },
        hidden: true
      },
      {
        path: 'edit-role/:id(\\d+)',
        component: () => import('@/views/permissions/role/edit'),
        name: 'EditRole',
        meta: { title: '编辑角色', noCache: true },
        hidden: true
      },
      {
        path: 'set-action/:id',
        component: () => import('@/views/permissions/role/setGroupAction'),
        name: 'SetGroupAction',
        meta: { title: '设置角色权限', noCache: true },
        hidden: true
      },
      {
        path: 'list-action',
        component: () => import('@/views/permissions/action/list'),
        name: 'actionList',
        meta: { title: '权限列表', icon: 'list', noCache: true }
      },
      {
        path: 'create-action',
        component: () => import('@/views/permissions/action/create'),
        name: 'CreateAction',
        meta: { title: '添加权限', icon: 'edit', noCache: true },
        hidden: true
      },
      {
        path: 'edit-action/:id',
        component: () => import('@/views/permissions/action/edit'),
        name: 'EditAction',
        meta: { title: '编辑权限', noCache: true },
        hidden: true
      },
      {
        path: 'change-password/',
        component: () => import('@/views/permissions/changePassword'),
        name: 'ChangePassword',
        meta: { title: '修改密码', icon: 'edit', noCache: true },
        hidden: false
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
