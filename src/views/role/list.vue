<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getTableData(1)'>
      <a-button type='primary' size='small' @click='btnAddLevel' v-permission="'createRole,POST'">新增</a-button>
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
          <a-button type='link' @click='btnAssignPermission(record)' v-permission="'createRule,POST'">分配权限</a-button>
          <a-button type='link' @click='btnEditLevel(record.id)' v-permission="'updateRole,POST'">修改</a-button>
          <a-button type='link' @click='btnDelLevel(record.id)' v-permission="'deleteRole,POST'">删除</a-button>
        </template>
        <template v-if="column.key==='status'">
          <el-switch
            v-permission="'updateRoleStatus,POST'"
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
  <a-drawer
    v-model:visible='drawerAssignPermission'
    class='custom-class'
    title='分配权限'
    placement='right'
  >
    <el-tree
      ref='treeRef'
      :data='treeData'
      show-checkbox
      :default-checked-keys='defaultCheckArr'
      default-expand-all
      node-key='rule_id'
      :props='defaultProps'
    >
      <template #default='{  data }'>
        <el-tag v-if='data.icon||data.frontpath'>菜单</el-tag>
        <el-tag v-else type='info'>权限</el-tag>
        {{ data.name }}
      </template>
    </el-tree>
    <div class='mt-1'>
      <el-button type='primary' @click='getCheckedKeys'>确定</el-button>
      <el-button>取消</el-button>
    </div>
  </a-drawer>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import API from '@/api/role'
import { reactive, ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import Form from '@/components/common/Form'
import { formColumns } from './formColumns'

const editId = ref()
const treeRef = ref(null)
const defaultProps = {
  children: 'child',
  label: 'name'
}
const treeData = ref([])
const drawerAssignPermission = ref(false)
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
    dataIndex: 'desc',
    key: 'desc'
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
const getRuleTree = async () => {
  const res = await API.getRuleTree()
  console.log(res)
  treeData.value = res.list
}
const TableData = ref([])
const getTableData = async (page = 1) => {
  const res = await API.getRoleList(page)
  TableData.value = res.list
  pagination.total = res.totalCount
  for (let i = 0; i < TableData.value.length; i++) {
    statusModel[`status${TableData.value[i].id}`] = TableData.value[i].status === 1
  }
}
const getCheckedKeys = async () => {
  const ids = treeRef.value.getCheckedKeys()
  const res = await API.setRuleTree(editId.value, ids)
  if (res) {
    drawerAssignPermission.value = false
    ElNotification.success('权限更新成功！')
  }
}

function pushId(rules) {
  const result = []
  Array.from(rules).forEach(item => {
    if (item.id) {
      result.push(item.id)
    }

    if (item.pivot) {
      result.push(...Object.values(item.pivot))
    }
  })
  console.log(result)
  return result
}

const defaultCheckArr = ref([])
const btnAssignPermission = (item) => {
  console.log(item)
  editId.value = item.id
  defaultCheckArr.value = pushId(item.rules)
  getRuleTree()
  if (treeData.value) {
    drawerAssignPermission.value = true
  }
}
getTableData(1)
const handleTableChange = (pag) => {
  getTableData(pag.current)
}
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  const res = await API.updateRoleStatus(id, { status })
  if (res) {
    ElNotification.success('状态更新成功！')
    await getTableData(1)
  }
}
const btnAddLevel = () => {
  drawerAddLevel.value = true
}

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
