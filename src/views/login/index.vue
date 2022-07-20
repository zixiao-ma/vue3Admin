<template>
  <el-row class='login-container'>
    <el-col class='el-col el-col-24 el-col-md-12 el-col-lg-16 left d-flex'>
      <h1>欢迎光临</h1>
    </el-col>
    <el-col class='el-col el-col-24 el-col-md-12 el-col-lg-8 right d-flex'>
      <div class='main'>
        <h1>欢迎回来</h1>
        <div class='title d-flex justify-content-center align-items-center'>
          <span class='line'></span>
          <span>账号密码登录</span>
          <span class='line'></span>
        </div>
        <div class='form-container'>
          <Form :data='FormData' @submit='login' :loading='loading' btn-title='登录'></Form>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'
import Form from '@/components/common/Form'
import { FormData } from '@/views/login/formData'
import { useStore } from 'vuex'

const store = useStore()

const loading = ref(false)

const login = async (data) => {
  try {
    loading.value = true
    await store.dispatch('user/login', data)
  } catch (error) {

  }
  loading.value = false
}
</script>

<style lang='scss' scoped>
.login-container {
  background-color: rgba(99, 102, 241);
  height: 100%;

  .left {
    justify-content: center;
    align-items: center;

    h1 {
      font-size: 3rem;
      color: #fff;
      font-weight: 700;
    }
  }

  .right {
    background-color: #fff;
    justify-content: center;
    align-items: center;

    .main {
      ::v-deep .el-button {
        width: 100%;
        border-radius: 50px;
        background-color: rgba(99, 102, 241);
        border-color: rgba(99, 102, 241);
      }

      h1 {
        font-size: 1.815rem;
        font-weight: 700;
        text-align: center;
      }

      .title {
        margin: 20px 0;

        .line {
          width: 4rem;
          display: inline-block;
          height: 1px;
          margin: 0 5px;
          background-color: rgba(229, 231, 235);

        }

        span {
          color: rgba(229, 231, 235);
        }
      }

    }
  }
}
</style>
