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
    <div class='hover subject' @click='subjectModel=true'>
      <el-tooltip content='主题色' placement='bottom'>

        <el-icon>
          <svg-icon icon='subject'></svg-icon>
        </el-icon>

      </el-tooltip>

    </div>
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
  <a-modal cancelText='恢复默认' ok-text='确定' @cancel='ModelCancel'
           v-model:visible='subjectModel' title='选择主题色' @ok='subjectModel=false'
           :keyboard='false'
           :maskClosable='false'>
    <div class='subColorBox'>
      <span class='subColor' ref='spanColor' v-for='item in 60' :key='item' @click='changeBGC(item)'
            :style='{background:getcolor()}'></span>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import Form from '@/components/common/Form'
import { FormData } from '@/layout/Header/formData'
import screenfull from 'screenfull'
import { ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

const subjectModel = ref(false)
const store = useStore()
const isScreenFull = ref(false)
const drawer = ref(false)
const showMydrawer = () => {
  drawer.value = true
  console.log(drawer)
}

function getcolor() {
  let str = '#'
  for (let i = 0; i < 6; i++) {
    const a = parseInt(Math.random() * 16)

    const str1 = a.toString(16)
    str += str1
  }
  return str
}

const spanColor = ref(null)
const changeBGC = (i) => {
  const bgc = spanColor.value[i - 1].style.background
  store.commit('subject/setBgc', bgc)
}
const toggleScreen = () => {
  isScreenFull.value = !isScreenFull.value
  screenfull.toggle()
}
const changePassword = data => {
  console.log(data)
}
const ModelCancel = () => {
  store.commit('subject/resetBackground')
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
      background-color: rgba(0, 0, 0, .2);
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

  .subject {
    font-size: 18px;
    padding: 0 5px;
    position: relative;
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
      background-color: rgba(0, 0, 0, .2);
    }
  }
}

.subColorBox {
  .subColor {
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 10px;
    margin: 5px;
    transition: all .3s;

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
