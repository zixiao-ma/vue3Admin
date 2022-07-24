/**
 * @author MaZiXiao
 * @date 2022-07-22 10:42
 */
import { getItem, setItem } from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    bgc: getItem('bgc') || 'rgb(67, 56, 202)'
  },
  mutations: {
    setBgc(state, color) {
      state.bgc = color
      setItem('bgc', state.bgc)
    },
    resetBackground(state) {
      state.bgc = 'rgb(67, 56, 202)'
      setItem('bgc', 'rgb(67, 56, 202)')
    }
  }
}
