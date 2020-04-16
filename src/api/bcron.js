import request from '@/utils/request'

export function fetchCronList(query) {
  return request({
    url: '/cron',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function fetchCron(cronId) {
  return request({
    url: '/cron/' + cronId,
    method: 'GET'
  })
}

export function createCron(data) {
  return request({
    url: '/cron',
    method: 'POST',
    data
  })
}

export function updateCron(data, cronId) {
  return request({
    url: '/cron/' + cronId,
    method: 'PATCH',
    data
  })
}

export function deleteCron(cronId) {
  return request({
    url: '/cron/' + cronId,
    method: 'DELETE'
  })
}
