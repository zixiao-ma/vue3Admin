<template>
  <div class='tagsview'>
    <tags-view></tags-view>
  </div>
  <main>
    <a-spin :spinning='$store.getters.loading'>
      <router-view></router-view>
    </a-spin>
  </main>
</template>

<script setup>
/* import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css' */
import TagsView from '@/layout/Main/components/tagsView'</script>
<style scoped lang='scss'>
main {
  height: 640px;
  overflow: auto;
}

::-webkit-scrollbar {
  display: none;
}
</style>
