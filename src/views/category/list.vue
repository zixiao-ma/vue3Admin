<template>
  <a-card style='margin-top: 10px'>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getSelectData'>
      <a-button type='primary' size='small' @click='btnAddCateGory'
      >新增
      </a-button
      >
    </top-action>
    <div style='height: 10px'></div>
    <el-row :gutter='20' v-for='(item,i) in selOptions' :key='item.id'>
      <el-col :span='16'>
        <span>{{ item.name }}</span>
      </el-col>
      <el-col :span='8'>
        <a-button type='link' @click='btnProductsFeatured(item)'>推荐商品</a-button>
        <el-switch
          v-model='statusModel[`status${i}`]'
          class='ml-2'
          @change='changeStatus(statusModel[`status${i}`],item.id)'
          style='--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'
        />
        <a-button type='link' @click='btnedit(item.id)'>修改</a-button>
        <a-button type='link' @click='del(item)'>删除</a-button>
      </el-col>
    </el-row>
  </a-card>
  <a-drawer
    v-model:visible='addCateGoryDrawer'
    class='custom-class'
    style='color: red'
    :title="isEdit.value ?'修改分类':'添加分类'"
    placement='right'
  >
    <From
      :data='fromAddCateGory'
      @submit='handleAddCateGory'
      btn-title='确定'
      :reset='true'
    ></From>
  </a-drawer>
  <a-drawer
    v-model:visible='productsFeaturedDrawer'
    class='custom-class'
    style='color: red'
    size='large'
    title='商品推荐'
    placement='right'
  >
    <my-table :data='tableList' :rules='options'>
      <template v-slot:banner='{row}'>
        <el-avatar shape='square' :size='50' :src='row.cover' />
      </template>
      <template v-slot:footer='{row}'>
        <a-button type='link' @click='delGoods(row)'>删除</a-button>
      </template>
    </my-table>
    <p style='height: 10px'></p>
    <el-button type='primary' @click='btnSelectAssociation'>选择关联</el-button>
    <el-button>取消</el-button>
  </a-drawer>

  <a-modal v-model:visible='DialogAddRelatedProducts' width='800px' :footer='null' title='选择商品'>
    <dialog-table @onSubmit='onDialogSubmit'></dialog-table>
  </a-modal>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import { reactive, ref } from 'vue'
import { getClassify } from '@/api/goodsList'
import From from '@/components/common/Form.vue'
import {
  addCateGory,
  addProductAssociation,
  delCateGory,
  deleteRecommendedProductList,
  editCateGory,
  getRecommendedProductList,
  updateStatus
} from '@/api/cateGory'
import { ElMessageBox, ElNotification } from 'element-plus'
import MyTable from '@/components/common/MyTable'
import { options } from '@/views/category/tableOptios'
import DialogTable from '@/views/category/dialogTable'

const statusModel = reactive({})
const isEdit = ref(false)
const selOptions = ref([])
const addCateGoryDrawer = ref(false)
const productsFeaturedDrawer = ref(false)
const editID = ref()
const DialogAddRelatedProducts = ref(false)
const btnSelectAssociation = () => {
  DialogAddRelatedProducts.value = true
}
const getSelectData = async () => {
  selOptions.value = await getClassify()
  for (let i = 0; i < selOptions.value.length; i++) {
    statusModel[`status${i}`] = selOptions.value[i].status === 1
  }
  console.log(statusModel)
}
const fromAddCateGory = {
  name: {
    label: '分类名称',
    showLabel: true,
    type: 'text'
  }
}
getSelectData()
const btnAddCateGory = () => {
  isEdit.value = false
  addCateGoryDrawer.value = true
}
const handleAddCateGory = async (data) => {
  const res = !isEdit.value ? await addCateGory(data) : await editCateGory(data, editID.value)
  if (res.name || res) {
    ElNotification.success(`${isEdit.value ? '修改' : '添加'}分类成功！`)
    await getSelectData()
    addCateGoryDrawer.value = false
  }
}
const del = item => {
  ElMessageBox.confirm(
    `确定要删除${item.name}分类吗?`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const res = await delCateGory(item.id)
    if (res) {
      ElNotification.success(`删除分类${item.name}成功！`)
      getSelectData()
    } else {
      ElNotification.error('删除失败！')
    }
  })
    .catch(() => {

    })
}
const btnedit = (id) => {
  editID.value = id
  isEdit.value = true
  addCateGoryDrawer.value = true
}
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  const res = await updateStatus({ status }, id)
  if (res) {
    ElNotification.success('状态更新成功！')
    getSelectData()
  }
}

const tableList = ref([])
const productListId = ref()
const btnProductsFeatured = async (item) => {
  productListId.value = item.id
  const res = await getRecommendedProductList(item.id)
  tableList.value = res
  if (res) productsFeaturedDrawer.value = true
}
const delGoods = row => {
  console.log(row)
  ElMessageBox.confirm(
    `确定要删除${row.name}吗?`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await deleteRecommendedProductList(row.id)
    tableList.value = await getRecommendedProductList(productListId.value)
    ElNotification.success('删除成功！')
  })
}
const onDialogSubmit = async (ids) => {
  const obj = { category_id: productListId.value, goods_ids: ids }
  try {
    const res = await addProductAssociation(obj)
    if (res === 'ok') {
      ElNotification.success('关联成功！')
      DialogAddRelatedProducts.value = false
      tableList.value = await getRecommendedProductList(productListId.value)
    }
    console.log(res)
  } catch (error) {

  }
}
</script>
<style lang='scss' scoped>
.el-row {
  padding: 5px 10px;
  transition: all 0.3s;

  line-height: 42px;

  &:hover {
    background-color: #f8f8f8;
  }
}
</style>
