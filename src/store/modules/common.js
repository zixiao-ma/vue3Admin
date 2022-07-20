/**
 * @author MaZiXiao
 * @date 2022-07-16 14:14
 */
export default {
  namespaced: true,
  state: {
    collapse: false
  },
  mutations: {
    setCollapse(state) {
      state.collapse = !state.collapse
    }
  }
}
