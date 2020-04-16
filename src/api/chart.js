import request from '@/utils/request'

export function fetchDownloaderProjectPV(projectId) {
  return request({
    url: 'chart/downloader/' + projectId,
    method: 'GET'
  })
}

export function fetchParserProjectPV(projectId) {
  return request({
    url: 'chart/parser/' + projectId,
    method: 'GET'
  })
}

export function fetchDownloaderPV() {
  return request({
    url: 'chart/downloader',
    method: 'GET'
  })
}

export function fetchParserPV() {
  return request({
    url: 'chart/parser',
    method: 'GET'
  })
}

export function fetchNodePV(nodeIp) {
  return request({
    url: 'chart/node-detail/' + nodeIp,
    method: 'GET'
  })
}

export function fetchCodeTypeDetail() {
  return request({
    url: 'chart/code-type-detail',
    method: 'GET'
  })
}
