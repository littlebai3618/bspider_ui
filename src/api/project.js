import request from '@/utils/request'

export function fetchProjectList(query) {
  return request({
    url: '/project',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function fetchProject(projectId) {
  return request({
    url: '/project/' + projectId,
    method: 'GET'
  })
}

export function createProject(data) {
  return request({
    url: '/project',
    method: 'POST',
    data
  })
}

export function updateProject(data, projectId) {
  return request({
    url: '/project/' + projectId,
    method: 'PATCH',
    data
  })
}

export function deleteProject(projectId) {
  return request({
    url: '/project/' + projectId,
    method: 'DELETE'
  })
}
