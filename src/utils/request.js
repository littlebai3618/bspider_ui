import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 204) {
      // 这里伪造一个response.data
      return {
        errno: 0,
        msg: 'delete success!'
      }
    }

    const res = response.data

    // 如果返回的不是正常请求
    if (res.errno !== 0) {
      if (res.errno === -1) {
        Message({
          message: res.msg || '未知错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: res.msg || '未知错误',
          type: 'warning',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    const res = error.response.data

    if (res.errno === -1) {
      Message({
        message: res.msg || '未知错误',
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      if (res.errno === 10002 || res.errno === 10003) {
        console.log(window.location.href)
        if (window.location.href.search('/login') === -1) {
          // to re-login
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or login again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          })
        }
      } else {
        Message({
          message: res.msg || '未知错误',
          type: 'warning',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(res)
  }
)

export default service
