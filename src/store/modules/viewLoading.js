/**
 * @author MaZiXiao
 * @date 2022-07-17 19:29
 */
export default {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    startLoading(state) {
      state.loading = true
    },
    closeLoading(state) {
      state.loading = false
    }
  }
}
