import request from '@/utils/request'

export function count() {
  return request({
    url: '/dashboard/count',
    method: 'post'
  })
}
