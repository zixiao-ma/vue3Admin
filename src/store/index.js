import { createStore } from 'vuex'
import user from './modules/user'
import getters from '@/store/getters'
import common from '@/store/modules/common'
import tag from './modules/tags'
import viewLoading from '@/store/modules/viewLoading'
import image from './modules/image'

export default createStore({
  getters,
  modules: { user, common, tag, viewLoading, image }
})
