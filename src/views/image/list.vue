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
        <a-pagination v-model:current='current' :defaultPageSize='8' :total='total' show-less-items />
      </el-col>
    </el-row>
  </a-card>
</template>

<script setup>
/* id: 168
images_count: 25
name: "化妆品"
order: 1001 */
import CLASSAPI from '@/api/image'
import { ref } from 'vue'

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
}
</script>
<style lang='scss' scoped>
.ant-btn {
  margin-right: 10px;
}

</style>
