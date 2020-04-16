import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

export function getCurrentUserInfo() {
  return request({
    url: '/tools/current_user',
    method: 'GET'
  })
}

export function fetchUserList(query) {
  return request({
    url: '/user',
    method: 'GET',
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search
    }
  })
}

export function fetchUser(userId) {
  return request({
    url: '/user/' + userId,
    method: 'GET'
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'POST',
    data
  })
}

export function updateUser(data, userId) {
  return request({
    url: '/user/' + userId,
    method: 'PATCH',
    data
  })
}
