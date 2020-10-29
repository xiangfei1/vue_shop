import axios from 'axios'

// 创建一个axios实例，并配置请求接口路径
const instance = axios.create({
  baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
})

// 设置请求拦截器
instance.interceptors.request.use(
  // config中包含请求头
  config => {
    const token = sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default instance
