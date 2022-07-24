<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getTableData'>
      <a-button type='primary' size='small' @click='btnAddLevel' v-permission="'createUserLevel,POST'">新增</a-button>
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
          <a-button type='link' @click='btnEditLevel(record.id)' v-permission="'updateUserLevel,POST'">修改</a-button>
          <a-button type='link' @click='btnDelLevel(record.id)' v-permission="'deleteUserLevel,POST'">删除</a-button>
        </template>
        <template v-if="column.key==='status'">
          <el-switch
            v-permission="'updateUserLevelStatus,POST'"
            v-model='statusModel[`status${record.id}`]'
            class='ml-2'
            @change='changeStatus(statusModel[`status${record.id}`],record.id)'
            style='--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'
          />
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
import API from '@/api/userLevel'
import { reactive, ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import Form from '@/components/common/Form'
import { formColumns } from '@/views/level/formColumns'

const drawerAddLevel = ref(false)
const statusModel = reactive({})
const columns = [
  {
    title: '角色名称',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '角色描述',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
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
  const res = await API.getLevelList(page)
  TableData.value = res.list
  pagination.total = res.totalCount
  for (let i = 0; i < TableData.value.length; i++) {
    statusModel[`status${TableData.value[i].id}`] = TableData.value[i].status === 1
  }
}

getTableData(1)
const handleTableChange = (pag) => {
  getTableData(pag.current)
}
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  const res = await API.updateLevelStatus(id, { status })
  if (res) {
    ElNotification.success('状态更新成功！')
    await getTableData(1)
  }
}
const btnAddLevel = () => {
  drawerAddLevel.value = true
}
const editId = ref()
const handleAddGoods = async data => {
  const res = await editId.value ? API.editLevel(editId.value, data) : API.addLevel(data)
  if (res) {
    await getTableData(1)
    drawerAddLevel.value = false
    ElNotification.success('操作成功！')
  }
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
      const res = await API.delLevel(id)
      if (res) {
        await getTableData()
        ElNotification.success('删除成功！')
      }
    })
}
</script>
<style scoped lang='scss'>
</style>
