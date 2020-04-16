import request from '@/utils/request'

export function fetchAllNodeList() {
  return request({
    url: '/tools/node-list',
    method: 'GET'
  })
}

export function fetchAllCodeList(data) {
  return request({
    url: '/tools/code-list',
    method: 'GET',
    params: data
  })
}

export function validCrontab(data) {
  return request({
    url: '/tools/validate/crontab',
    method: 'GET',
    params: data
  })
}

export function ParserException(projectId) {
  return request({
    url: '/tools/parser/exception/' + projectId,
    method: 'GET'
  })
}

export function DownloaderException(projectId) {
  return request({
    url: '/tools/downloader/exception/' + projectId,
    method: 'GET'
  })
}

export function fetchCrawlDetail(data) {
  return request({
    url: '/tools/crawl-detail',
    method: 'GET',
    params: data
  })
}

export function fetchNodeDetail() {
  return request({
    url: '/tools/node-detail',
    method: 'GET'
  })
}

export function exceptionProjectList() {
  return request({
    url: '/tools/exception-project',
    method: 'GET'
  })
}
