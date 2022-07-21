<template>
  <a-card>
    <div class='top'>
      <a-button type='primary' size='small'>新增图片分类</a-button>
      <a-button type='danger' size='small'>上传图片</a-button>
    </div>
    <el-row :gutter='20' style='margin-top: 10px'>
      <el-col :span='4'>
        <el-tabs tab-position='left' class='demo-tabs' @tab-change='changeTab' closable stretch>
          <el-tab-pane v-for='item in classList' :key='item.id'
                       :label='item.name'></el-tab-pane>
        </el-tabs>
        <el-button @click='getClassList(1)'>
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
        </el-button>
        <el-button @click='getClassList(2)'>
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </el-button>
      </el-col>
      <el-col :span='20'>
        <div class='imgmainbox'>
          <div class='imgbox' v-for='(item,index) in imgList' :key='item.id'>
            <div class='imgtop'>
              <img :src='item.url'>
              <p class='imgtitle'>{{ item.name }}</p>
            </div>
            <div class='imgfot d-flex justify-content-center'>
              <a-checkbox v-model:checked='checkboxStatus[`ckb${index}`]' @change='addImgUrl(item)'></a-checkbox>
              <a-button type='link'>重命名</a-button>
              <a-button type='link'>删除</a-button>
            </div>
          </div>
        </div>
        <div class='d-flex justify-content-center align-items-center mt-2'>
          <a-pagination v-model:current='current' :defaultPageSize='8' :total='total' show-less-items />
        </div>
      </el-col>
    </el-row>
  </a-card>
</template>

<script setup>

import CLASSAPI from '@/api/image'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'

const checkboxStatus = reactive({})
const current = ref(1)
const total = ref(0)
const classList = ref([])
const getClassList = async (page = 1) => {
  const res = await CLASSAPI.getImageClassList(page)
  classList.value = res.list
  changeTab(0)
}
getClassList()
const imgList = ref([])
const changeTab = async index => {
  const id = classList.value[index].id
  const res = await CLASSAPI.getImageList(id, current.value)
  console.log(res)
  imgList.value = res.list
  total.value = res.totalCount
  for (let i = 0; i < res.list.length; i++) {
    checkboxStatus[`ckb${i}`] = false
  }
  console.log(checkboxStatus)
}
const store = useStore()
const addImgUrl = (item) => {
  store.commit('image/addImgUrl', { name: item.name, url: item.url })
}
</script>
<style lang='scss' scoped>
.ant-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.imgbox {
  width: 220px;
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  background-color: #fff;
  overflow: hidden;

}

.imgtop {
  position: relative;
  height: 150px;

  img {
    transition: all .3s;
    width: 100%;
    height: 150px;
  }

  .imgtitle {
    position: absolute;
    bottom: -14px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
  }

}

.imgmainbox {
  display: flex;
  flex-wrap: wrap;
  height: 500px;
  overflow: auto;

}
</style>
