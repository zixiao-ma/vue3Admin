<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getTableData'>
      <a-button type='primary' size='small' @click='addAccessDrawer = true'>新增</a-button>
    </top-action>
    <a-table :dataSource='tableList' :columns='columns' row-key='id' childrenColumnName='child' class='mt-1'>
      <template #bodyCell='{ column, record }'>
        <template v-if="column.key === 'name'">
          <a>
            <a-tag v-if='record.menu===1' color='#108ee9'>菜单</a-tag>
            <a-tag v-if='record.menu===0'>权限</a-tag>
            {{ record.name }}
          </a>
        </template>
        <template v-if="column.key==='operating'">
          <el-switch
            v-model='statusModel[`status${record.id}`]'
            class='ml-2'
            @change='changeStatus(statusModel[`status${record.id}`],record.id)'
            style='--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'
          />
          <a-button type='link' @click='addAccessDrawer = true'>修改</a-button>
          <a-button type='link' @click='addAccessDrawer = true'>增加</a-button>
          <a-button type='link' @click='del(record.id)'>删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-drawer
    v-model:visible='addAccessDrawer'
    class='custom-class'
    title='新增菜单'
    placement='right'
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import API from '@/api/access'
import { reactive, ref } from 'vue'
import { columns } from './columns'
import { ElMessageBox, ElNotification } from 'element-plus'

const addAccessDrawer = ref(false)
const tableList = ref()
const statusModel = reactive({})
const getTableData = async () => {
  const res = await API.getMenuRights()
  console.log(res)
  tableList.value = res.list

  addSwitchModel(tableList.value)
  console.log(statusModel)
}

function addSwitchModel(data) {
  for (let i = 0; i < data.length; i++) {
    statusModel[`status${data[i].id}`] = data[i].status === 1
    if (data[i].child) {
      addSwitchModel(data[i].child)
    } else {
      return
    }
  }
}

getTableData()
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  try {
    const res = await API.updateStatus(id, { status })
    if (res.data) {
      ElNotification.success('状态更新成功！')
    }
  } catch (error) {

  }
  await getTableData()
}
const del = (id) => {
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
      const res = await API.deleteRule(id)
      if (res) {
        await getTableData()
        ElNotification.success('删除成功！')
      }
    })
}
</script>
<style lang='scss' scoped>

</style>
