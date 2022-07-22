/**
 * @author MaZiXiao
 * @date 2022-07-22 10:42
 */
export default {
  namespaced: true,
  state: {
    bgc: 'rgb(67, 56, 202)'
  },
  mutations: {
    setBgc(state, color) {
      state.bgc = color
    },
    resetBackground(state) {
      state.bgc = 'rgb(67, 56, 202)'
    }
  }
}
