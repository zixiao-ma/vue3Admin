<template>
  <el-container class='w-100 h-100'>
    <el-header class='d-flex justify-content-between align-items-center'>
      <app-header></app-header>
    </el-header>
    <el-container class='mainmain'>
      <el-aside :width="$store.getters.collapse?'64px':'250px'">
        <app-aside></app-aside>
      </el-aside>
      <el-main>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AppAside from './Aside'
import AppMain from './Main'
import AppHeader from './Header'</script>
<style scoped lang='scss'>
.el-header {
  background-color: rgb(67, 56, 202);
  position: fixed;
  top: 0;
  width: 100%;
}

.mainmain {
  margin-top: 60px;
  overflow: auto;
}

.el-aside {
  background-color: #fff;
  transition: all .3s;
}

.el-main {
  background-color: rgb(229, 231, 235);
  padding: 5px;
}

::-webkit-scrollbar {
  display: none;
}
</style>
