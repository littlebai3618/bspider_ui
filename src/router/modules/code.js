/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const codeRouter = {
  path: '/code',
  redirect: '/code/list',
  component: Layout,
  // alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'list',
      component: () => import('@/views/code/list'),
      name: 'CodeList',
      meta: { title: 'Code Store', noCache: true, icon: 'code-router', roles: ['admin', 'work'] }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/code/edit'),
      name: 'EditCode',
      meta: { title: 'Edit Code', activeMenu: '/code/list' },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/code/create'),
      name: 'CreateCode',
      meta: { title: 'Create Code', activeMenu: '/code/list' },
      hidden: true
    }
  ]
}
export default codeRouter
