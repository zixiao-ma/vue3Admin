/**
 * @author MaZiXiao
 * @date 2022-07-15 19:31
 */
/**
 * @author YangLing
 * @date 2022/7/15 09:26
 */

import App from '@/App'
// import store from '@/store'
import { createApp } from 'vue'

const arr = ['add']
const app = createApp(App)
app.directive('permission', {
  mounted(el, binding) {
    // 获取后台所返回按钮权限列表
    const permissionList = arr
    // 获取当前按钮所绑定的权限
    const value = binding.value
    // 判断按钮所绑定的权限是否在后台所返回的按钮权限列表中
    if (!permissionList.includes(value)) {
      // 如果不存在，则移除按钮
      el.style = 'display:none'
      setTimeout(() => {
        el.parentNode && el.parentNode.removeChild(el)
      }, 0)
    }
  }
})
