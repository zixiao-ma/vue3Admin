<template>
  <div>
    <el-menu
      :default-active='$route.path'
      class='el-menu-vertical-demo'
      :collapse='$store.getters.collapse'
      :collapse-transition='true'
      router
    >
      <menu-item v-for='item in MenuList' :key='item.id' :tree='item'></menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import MenuItem from '@/layout/Aside/MenuItem'
import { filterMenuData } from '@/utils/menu'
import { useStore } from 'vuex'

const store = useStore()
const MenuList = filterMenuData(store.getters.menus)

</script>

<style scoped lang='scss'>
.el-menu {
  position: inherit !important;
}

</style>
