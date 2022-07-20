<template>

  <div class='left d-flex justify-content-center align-items-center'>
    <div class='title-box'>
      <el-icon>
        <ElementPlus />
      </el-icon>
      <p class='title'>帝莎编程商城后台</p>
    </div>
    <div class='hover' @click='$store.commit("common/setCollapse")'>
      <el-tooltip content='折叠菜单' placement='bottom'>

        <el-icon v-if='!$store.getters.collapse'>
          <Fold />
        </el-icon>
        <el-icon v-else>
          <Expand />
        </el-icon>

      </el-tooltip>
    </div>
    <div class='hover' @click='refresh'>
      <el-tooltip content='刷新' placement='bottom'>
        <el-icon>
          <el-icon>
            <Refresh />
          </el-icon>
        </el-icon>
      </el-tooltip>
    </div>
  </div>
  <div class='right d-flex justify-content-center align-items-center'>
    <div class='FullScreen hover' @click='toggleScreen'>
      <el-tooltip :content="isScreenFull?'退出全屏':'全屏'" placement='bottom'>

        <el-icon v-if='!isScreenFull'>
          <FullScreen />
        </el-icon>
        <el-icon v-else>
          <Aim />
        </el-icon>
      </el-tooltip>
    </div>
    <el-avatar size='small'
               src='https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    />
    <el-dropdown>
    <span class='el-dropdown-link'>
      {{ $store.getters.userInfo.username }}
      <el-icon class='el-icon--right'>
        <arrow-down />
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click='showMydrawer'>修改密码</el-dropdown-item>
          <el-dropdown-item @click='logout()'>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <a-drawer
      v-model:visible='drawer'
      class='custom-class'
      title='修改密码'
      placement='right'
    >
      <Form :data='FormData' ref='formRef' @submit='changePassword' :reset='true' btn-title='修改'></Form>
    </a-drawer>

  </div>

</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import Form from '@/components/common/Form'
import { FormData } from '@/layout/Header/formData'
import screenfull from 'screenfull'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const isScreenFull = ref(false)
const drawer = ref(false)
const showMydrawer = () => {
  drawer.value = true
  console.log(drawer)
}
const toggleScreen = () => {
  isScreenFull.value = !isScreenFull.value
  screenfull.toggle()
}
const changePassword = data => {
  console.log(data)
}
const refresh = () => {
  window.location.reload()
}
const logout = () => {
  ElMessageBox.confirm('您确定退出登录吗?')
    .then(() => {
      store.dispatch('user/logout')
    })
    .catch(() => {
      // catch error
    })
}
</script>

<style scoped lang='scss'>

.el-dropdown-link {
  color: #fff;
}

.left {
  color: #fff;
  height: 100%;

  .title {
    font-weight: 100;
    font-size: 1.25rem;
    margin: 0 !important;

  }

  & > div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px;
  }

  .el-icon {
    margin: 0 5px;
    font-size: 20px;
  }

  .hover {
    &:hover {
      background-color: rgba(99, 102, 241);
    }
  }

}

.right {
  color: #fff;
  height: 100%;

  .FullScreen {
    .el-icon {
      margin: 0 5px;
      font-size: 20px;
    }
  }

  & > div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 5px;
  }

  .hover {
    &:hover {
      background-color: rgba(99, 102, 241);
    }
  }
}

</style>
