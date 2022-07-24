<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getSkuList()'>
      <a-button type='primary' size='small'
                @click='btnOpenDiawerAddSku'
                v-permission="'createSkus,POST'"
      >新增
      </a-button
      >
      <a-button type='danger' size='small' @click='plDel' v-permission="'deleteSkus,POST'">批量删除</a-button>
    </top-action>
    <a-table
      style='margin-top: 10px'
      :row-selection='{ selectedRowKeys:state.selectedRowKeys, onChange: onSelectChange }'
      :dataSource='tableData'
      row-key='id'
      :pagination='pagination'
      :columns='columns'
      @change='handleTableChange'
      size='small'

    >
      <template #bodyCell='{ column ,record}'>
        <template v-if="column.key==='status'">
          <el-switch
            v-permission="'updateSkusStatus,POST'"
            v-model='statusModel[`status${record.id}`]'
            class='ml-2'
            @change='changeStatus(statusModel[`status${record.id}`],record.id)'
            style='--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949'
          />
        </template>
        <template v-if="column.key==='operating'">
          <a-button type='link' @click='editSku(record)' v-permission="'updateSkus,POST'">修改</a-button>
          <a-button type='link' @click='del(record.id)' v-permission="'deleteSkus,POST'">删除</a-button>
        </template>
      </template>
    </a-table>
  </a-card>
  <a-drawer
    v-model:visible='diawerAddSku'
    width='500px'
    class='custom-class'
    :title="isedit?'修改规格':'添加规格'"
    placement='right'
  >
    <p class='drawerP'>规格名称：
      <el-input v-model='formModel.name' placeholder='规格名称'></el-input>
    </p>
    <p>排序：
      <el-input-number v-model='formModel.order'></el-input-number>
    </p>
    <p>状态：
      <el-switch v-model='formModel.status'></el-switch>
    </p>
    <p>规格值：
      <el-tag
        v-for='tag in formModel.default'
        :key='tag'
        class='mx-1'
        closable
        :disable-transitions='false'
        @close='handleClose(tag)'
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-if='inputVisible'
        ref='InputRef'
        style='width: 90px;'
        v-model='inputValue'
        class='ml-1 w-20'
        size='small'
        @keyup.enter='handleInputConfirm'
        @blur='handleInputConfirm'
      />
      <el-button v-else class='button-new-tag ml-1' size='small' @click='showInput'>
        + New Tag
      </el-button>
    </p>
    <template #footer>
      <a-button style='margin-right: 8px' @click='diawerAddSku=false'>取消</a-button>
      <a-button type='primary' @click='onSubmit'>确定</a-button>
    </template>
  </a-drawer>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import SKUAPI from '@/api/skus'
import { nextTick, reactive, ref } from 'vue'
import { columns } from './columns.js'
import { ElMessageBox, ElNotification } from 'element-plus'
/* default: "213,213,123"
name: "21"
order: 50
status: 1 */
const formModel = reactive({
  name: '',
  order: 0,
  status: true,
  default: []
})
const inputVisible = ref(false)
const inputValue = ref('')
const statusModel = reactive({})
const state = reactive({
  selectedRowKeys: []
})
const diawerAddSku = ref(false)
const tableData = ref([])
const onSelectChange = selectedRowKeys => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys
}
const InputRef = ref(null)
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.focus()
  })
}
const isedit = ref(false)
const btnOpenDiawerAddSku = () => {
  isedit.value = false
  formModel.name = ''
  formModel.order = 0
  formModel.status = true
  formModel.default = []
  diawerAddSku.value = true
}

const pagination = reactive({
  pageNum: 1,
  total: 36
})
const handleInputConfirm = () => {
  if (inputValue.value) {
    formModel.default.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
const getSkuList = async () => {
  const res = await SKUAPI.getSkusList(pagination.pageNum)
  tableData.value = res.list
  pagination.total = res.totalCount
  for (let i = 0; i < tableData.value.length; i++) {
    statusModel[`status${tableData.value[i].id}`] = tableData.value[i].status === 1
  }
  console.log(statusModel, 'statusModel')
}
getSkuList()
const handleTableChange = (pag) => {
  pagination.pageNum = pag.current
  getSkuList()
}
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  const res = await SKUAPI.updateStatus({ status }, id)
  if (res) {
    ElNotification.success('状态更新成功！')
    getSkuList()
  }
}
const plDel = () => {
  const arr = Object.values(state.selectedRowKeys)
  ElMessageBox.confirm(
    '确定要删除规格吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await SKUAPI.deleteSkuList({ ids: arr })
    getSkuList()
  })
    .catch(() => {

    })
}
const del = (id) => {
  ElMessageBox.confirm(
    '确定要删除规格吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    await SKUAPI.deleteSkuList({ ids: [id] })
    getSkuList()
  })
}
const onSubmit = async () => {
  if (!formModel.name && formModel.default.length <= 0) {
    ElNotification.error('请填写名称和规格值')
    return
  }
  const str = formModel.default.join(',')
  const obj = {
    name: formModel.name,
    order: formModel.order,
    status: formModel.status ? 1 : 0,
    default: str
  }
  const res = await isedit.value ? SKUAPI.editSkus(obj, formModel.id) : SKUAPI.addSkus(obj)
  if (res) {
    diawerAddSku.value = false
    await getSkuList()
    ElNotification.success('操作成功！')
  }
}
const editSku = (row) => {
  isedit.value = true
  diawerAddSku.value = true
  formModel.name = row.name
  formModel.order = row.order
  formModel.status = row.status === 1
  formModel.default = row.default.split(',')
  formModel.id = row.id
}
</script>
<style lang='scss' scoped>
.ant-btn {
  margin-right: 10px;
}

.drawerP {
  display: flex;

  .el-input {
    width: 250px;
  }
}
</style>
