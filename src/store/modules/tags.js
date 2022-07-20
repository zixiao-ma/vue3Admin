import { getItem, setItem } from '@/utils/storage'
import { TAGS_VIEW_KEY } from '@/utils/publicVariable'
import { DeepCopy } from '@/utils/deepCopy'

export default {
  namespaced: true,
  state: () => ({
    tagsArray: getItem(TAGS_VIEW_KEY) || []
  }),
  mutations: {
    addTag(state, tag) {
      const data = state.tagsArray.find(item => item.path === tag.path)
      if (!data) {
        state.tagsArray.push(tag)
        setItem(TAGS_VIEW_KEY, state.tagsArray)
      }
    },
    delTag(state, index) {
      state.tagsArray.splice(index, 1)
      setItem(TAGS_VIEW_KEY, state.tagsArray)
    },
    delAllTag(state) {
      state.tagsArray = []
      setItem(TAGS_VIEW_KEY, state.tagsArray)
    },
    delOtherTag(state, index) {
      const nowTag = DeepCopy(state.tagsArray[index])
      state.tagsArray = [nowTag]
    }
  }
}
