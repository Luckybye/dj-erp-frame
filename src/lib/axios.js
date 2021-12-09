import axios from 'axios'
/* eslint-disable */
// 创建axios实例
console.log(process.env.BASE_API, process.env)
const service = axios.create({
  baseURL: process.env.BASE_URL, // api的base_url
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  return config
}, error => {
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 判断code
    // if (res.errcode === '9999') {
    //   location.reload()
    // }
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
