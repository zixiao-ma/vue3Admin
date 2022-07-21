<template>
  <div class='tagsview'>
    <tags-view></tags-view>
  </div>
  <main>
    <loading v-model:active='$store.getters.loading'
             :can-cancel='true'
             :is-full-page='true'>
      <img src='./loading.gif' alt='' style='width: 200px;height: 200px;'>
    </loading>
    <router-view></router-view>
  </main>
</template>

<script setup>
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
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
