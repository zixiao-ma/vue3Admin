import axios from 'axios'
import loading from '@/utils/loading'
import { ElNotification } from 'element-plus'
import store from '@/store'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000
})
// 添加请求拦截器

instance.interceptors.request.use(
  function(config) {
    // TODO 添加token
    // loading 可选 全屏loading和加载进度条
    // loading.elLoading.start()
    const token = store.getters.token
    if (token) config.headers.token = token
    loading.nprogress.start()
    store.commit('viewLoading/startLoading')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    // loading.elLoading.done()
    loading.nprogress.done()
    store.commit('viewLoading/closeLoading')
    const { status, data: { data, msg } } = response
    if (status === 200 || msg === 'ok') {
      return data
    }
  },
  function(error) {
    // 对响应错误做点什么
    loading.nprogress.done()
    store.commit('viewLoading/closeLoading')
    const msg = error.toString()
    if (msg.includes('NetWork')) {
      ElNotification.error('网络错误，请检查您的网络！')
    }
    if (msg.includes('Timeout')) {
      ElNotification.error('请求超时，请检查您的网络！')
    }
    console.log(error, 'error')
    const { status } = error.response
    const messageError = error.response.data.msg
    switch (status) {
      case 400:
        ElNotification.error(messageError)
        break
      case 401:
        ElNotification.error('Token超时,请重新登录！')
        // TODO token过期处理
        /* store.commit('user/loginOut')
         router.push({name: 'login'}) */
        break
      case 404:
        ElNotification.error('访问接口地址不正确！')
        break
      case 500:
        ElNotification.error('服务器发生错误！')
        break
      case 503:
        ElNotification.error('服务暂时不可用！')
        break
      case 408:
        ElNotification.error('客户端请求超时!')
        break
    }
    return Promise.reject(error)
  }
)

export default instance
