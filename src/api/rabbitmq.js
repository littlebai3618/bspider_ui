import request from '@/utils/request'

export function fetchProjectQueue(projectId) {
  return request({
    url: 'rabbitmq/project/' + projectId,
    method: 'GET'
  })
}

export function purgeRequest(projectId) {
  return request({
    url: 'rabbitmq/project/purge/' + projectId,
    method: 'DELETE'
  })
}
