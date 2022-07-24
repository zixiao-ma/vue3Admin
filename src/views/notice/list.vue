<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getTableData'>
      <a-button type='primary' size='small' @click='btnAddLevel' v-permission="'createNotice,POST'">新增</a-button>
    </top-action>
    <a-table
      style='margin-top: 10px;'
      :dataSource='TableData'
      row-key='id'
      :pagination='pagination'
      :columns='columns'
      @change='handleTableChange'
      size='small'

    >
      <template #bodyCell='{ column,record }'>
        <template v-if="column.key==='operating'">
          <a-button type='link' @click='btnEditLevel(record.id)' v-permission="'updateNotice,POST'">修改</a-button>
          <a-button type='link' @click='btnDelLevel(record.id)' v-permission="'deleteNotice,POST'">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-drawer
    v-model:visible='drawerAddLevel'
    class='custom-class'
    title='添加'
    placement='right'
  >
    <Form :data='formColumns' @submit='handleAddGoods' btn-title='确定' :reset='true'></Form>
  </a-drawer>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import API from '@/api/notice'
import { reactive, ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import Form from '@/components/common/Form'
import { formColumns } from './formColumns'

const drawerAddLevel = ref(false)
const columns = [
  {
    title: '公告标题',
    key: 'title',
    dataIndex: 'title'
  },
  {
    title: '发布时间',
    dataIndex: 'create_time',
    key: 'create_time'
  },

  {
    title: '操作',
    key: 'operating'
  }
]
const pagination = reactive({
  total: 36
})
const TableData = ref([])
const getTableData = async (page = 1) => {
  const res = await API.getRoleList(page)
  TableData.value = res.list
  pagination.total = res.totalCount
}

getTableData(1)
const handleTableChange = (pag) => {
  getTableData(pag.current)
}

const btnAddLevel = () => {
  drawerAddLevel.value = true
}
const editId = ref()
const handleAddGoods = async data => {
  const res = await editId.value ? API.editRole(editId.value, data) : API.addRole(data)
  if (res) {
    drawerAddLevel.value = false
    ElNotification.success('操作成功！')
  }
  await getTableData(1)
}
const btnEditLevel = id => {
  editId.value = id
  drawerAddLevel.value = true
}
const btnDelLevel = (id) => {
  ElMessageBox.confirm(
    '您确定要删除吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const res = await API.delRole(id)
      if (res) {
        await getTableData()
        ElNotification.success('删除成功！')
      }
    })
}
</script>
<style scoped lang='scss'>
</style>
