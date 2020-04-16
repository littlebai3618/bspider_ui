/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cronRouter = {
  path: '/operation',
  redirect: '/operation/list',
  component: Layout,
  // alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'list',
      component: () => import('@/views/operation/list'),
      name: 'OperationList',
      meta: { title: 'Operation', noCache: true, icon: 'operation-router', roles: ['admin'] }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/operation/edit'),
      name: 'EditCron',
      meta: { title: 'Edit Cron', activeMenu: '/operation/list' },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/operation/create'),
      name: 'CreateCron',
      meta: { title: 'Create Cron', activeMenu: '/operation/list' },
      hidden: true
    }
  ]
}
export default cronRouter
