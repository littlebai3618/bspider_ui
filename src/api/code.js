import request from '@/utils/request'

export function fetchCodeList(query) {
  return request({
    url: '/code',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function fetchCode(codeId) {
  return request({
    url: '/code/' + codeId,
    method: 'GET'
  })
}

export function createCode(data) {
  return request({
    url: '/code',
    method: 'POST',
    data
  })
}

export function updateCode(data, codeId) {
  return request({
    url: '/code/' + codeId,
    method: 'PATCH',
    data
  })
}

export function deleteCode(codeId) {
  return request({
    url: '/code/' + codeId,
    method: 'DELETE'
  })
}
