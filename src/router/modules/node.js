/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nodeRouter = {
  path: '/resource',
  component: Layout,
  redirect: '/resource/node',
  name: 'Resource',
  meta: {
    title: 'Resource',
    icon: 'resource-router',
    roles: ['admin', 'work']
  },
  children: [
    {
      path: 'node',
      component: () => import('@/views/node/NodeList'),
      name: 'NodeManager',
      meta: { title: 'Node Manager', icon: 'node-router', activeMenu: '/resource/node' }
    },
    {
      path: 'worker',
      component: () => import('@/views/node/WorkerList'),
      name: 'WorkerManager',
      meta: { title: 'Worker Manager', icon: 'worker-router' }
    },
    {
      path: 'node/detail/:id(\\d+)',
      component: () => import('@/views/node/NodeDetail'),
      name: 'NodeDetail',
      meta: { title: 'Node Detail', icon: 'worker-router', noCache: true, activeMenu: '/resource/node' },
      hidden: true
    }
  ]
}
export default nodeRouter

