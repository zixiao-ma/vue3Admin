<template>
  <div id='app'>
    <router-view></router-view>
  </div>

</template>

<style lang='scss'>
html, body, #app {
  height: 100%;
  width: 100%;
}

::-webkit-scrollbar {
  overflow: hidden;
}

.el-card__body {
  padding: 0 !important;
}
</style>
