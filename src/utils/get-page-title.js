import defaultSettings from '@/settings'

const title = defaultSettings.title || 'BSpider Studio'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
