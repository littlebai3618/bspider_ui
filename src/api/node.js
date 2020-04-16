import request from '@/utils/request'

export function fetchNodeList(query) {
  return request({
    url: '/node',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function fetchNode(nodeId) {
  return request({
    url: '/node/' + nodeId,
    method: 'GET'
  })
}

export function updateNode(data, nodeId) {
  return request({
    url: '/node/' + nodeId,
    method: 'PATCH',
    data
  })
}

export function fetchWorkerList(query) {
  return request({
    url: '/worker',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function updateWorker(data, workerId) {
  return request({
    url: '/worker/' + workerId,
    method: 'PATCH',
    data
  })
}

export function createWorker(data) {
  return request({
    url: '/worker',
    method: 'POST',
    data
  })
}
