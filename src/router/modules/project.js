/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const projectRouter = {
  path: '/project',
  redirect: '/project/list',
  component: Layout,
  // alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'list',
      component: () => import('@/views/project/list'),
      name: 'ProjectList',
      meta: { title: 'Project', noCache: true, icon: 'project-router', roles: ['admin', 'work'] }
    },
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/project/list/edit'),
      name: 'EditProject',
      meta: { title: 'Edit Project', activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'create',
      component: () => import('@/views/project/list/create'),
      name: 'CreateProject',
      meta: { title: 'Create Project', activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'detail/:id(\\d+)',
      component: () => import('@/views/project/detail'),
      name: 'ProjectDetail',
      meta: { title: 'Project Detail', activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'operation/edit/:id(\\d+)',
      component: () => import('@/views/project/list/editProjectCron'),
      name: 'EditProjectCron',
      meta: { title: 'Edit Project Cron', activeMenu: '/project/list' },
      hidden: true
    },
    {
      path: 'operation/create',
      component: () => import('@/views/project/list/createProjectCron'),
      name: 'CreateProjectCron',
      meta: { title: 'Create Project Cron', activeMenu: '/project/list' },
      hidden: true
    }
  ]
}
export default projectRouter
