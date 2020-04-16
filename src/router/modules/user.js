/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  redirect: '/user/list',
  component: Layout,
  // alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'UserList',
      meta: { title: 'User Center', noCache: true, icon: 'user-router', roles: ['admin'] }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/user/edit'),
      name: 'EditUser',
      meta: { title: 'Edit User', activeMenu: '/user/list' },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/user/create'),
      name: 'CreateUser',
      meta: { title: 'Create User', activeMenu: '/user/list' },
      hidden: true
    }
  ]
}
export default userRouter
