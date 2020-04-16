/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const toolsRouter = {
  path: '/tools',
  redirect: '/tools/list',
  component: Layout,
  // alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'list',
      component: () => import('@/views/tools/list'),
      name: 'ToolsList',
      meta: { title: 'Tools', icon: 'tools-router', roles: ['admin', 'work', 'read'] }
    },
    {
      path: 'crawl-detail',
      component: () => import('@/views/tools/components/CrawlDetail'),
      name: 'CrawlDetail',
      meta: { title: 'Crawl Detail', activeMenu: '/tools/list' },
      hidden: true
    },
    {
      path: 'crontab-editor',
      component: () => import('@/views/tools/components/CrontabEditor'),
      name: 'CrontabEditor',
      meta: { title: 'Crontab Editor', activeMenu: '/tools/list' },
      hidden: true
    }
  ]
}
export default toolsRouter
