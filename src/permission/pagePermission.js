/**
 * @author MaZiXiao
 * @date 2022-07-15 19:31
 */
import router from '@/router'
import store from '@/store'
import { dynamicRouting } from '@/utils/dynamicRouting'
import { filterMenuData } from '@/utils/menu'

router.beforeEach(async (to, from, next) => {
  const token = store.getters.token
  const hasUserInfo = store.getters.hasUserInfo
  if (to.path !== '/login' && to.path !== '/') {
    if (to.meta.title) {
      const obj = {
        title: to.meta.title,
        path: to.path
      }
      store.commit('tag/addTag', obj)
    }
  }
  if (to.path === '/login' && token) {
    if (from.path) {
      return next(from.path)
    } else {
      return next('/')
    }
  }
  if (to.path !== '/login' && !token) {
    return next('/login')
  }
  if (to.path !== '/login' && token) {
    if (hasUserInfo) {
      const res = await store.dispatch('user/getUserInfo')
      const menuData = filterMenuData(res.menus)
      if (res && menuData) {
        const data = dynamicRouting(menuData)
        await data.forEach(item => {
          router.addRoute('layout', item)
        })
        return next(to.path)
      } else {
        return next('/login')
      }
    }
    // TODO判a断用户信息
  }
  next()
})
