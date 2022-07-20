/**
 * @author MaZiXiao
 * @date 2022-07-15 19:04
 */
import { getItem, setItem } from '@/utils/storage'
import { MENUS_LIST, TAGS_VIEW_KEY, TOKEN_KEY } from '@/utils/publicVariable'
import USER_API from '@/api/user'
import { ElNotification } from 'element-plus'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    token: getItem(TOKEN_KEY) || '',
    userInfo: {},
    menus: getItem(MENUS_LIST) || [],
    ruleNames: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN_KEY, token)
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    setMenus(state, payload) {
      state.menus = payload
      setItem(MENUS_LIST, payload)
    },
    setRuleNames(state, payload) {
      state.ruleNames = payload
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const res = await USER_API.login(data)
        if (res.token) {
          commit('setToken', res.token)
          await router.push('/')
          ElNotification.success('登录成功！')
        }
        return res
      } catch (error) {
        console.log(error)
      }
    },
    async getUserInfo({ commit }) {
      try {
        const res = await USER_API.getUserInfo()
        await commit('setMenus', res.menus)
        await commit('setRuleNames', res.ruleNames)
        await commit('setUserInfo', {
          avatar: res.avatar,
          id: res.id,
          role: res.role,
          super: res.super,
          username: res.username
        })
        return res
      } catch (error) {

      }
    },
    async logout({ commit }) {
      await USER_API.logout()
      setItem(TOKEN_KEY, '')
      setItem(TAGS_VIEW_KEY, [])
      await commit('setMenus', [])
      await commit('setRuleNames', [])
      await commit('setUserInfo', {})
      await window.location.reload()
      ElNotification.success('退出成功！')
    }

  }
}
