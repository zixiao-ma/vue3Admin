/**
 * @author MaZiXiao
 * @date 2022-07-21 16:54
 */
export default {
  namespaced: true,
  state: {
    urlList: []
  },
  mutations: {
    addImgUrl(state, obj) {
      state.urlList.push(obj)
    },
    removeUrl(state) {
      state.urlList = []
    }
  }
}
