/**
 * @author MaZiXiao
 * @date 2022-07-15 19:32
 */
export default {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menus: state => state.user.menus,
  ruleNames: state => state.user.ruleNames,
  hasUserInfo: state => {
    return JSON.stringify(state.user.userInfo) === '{}'
  },
  collapse: state => state.common.collapse,
  tags: state => state.tag.tagsArray,
  loading: state => state.viewLoading.loading
}
