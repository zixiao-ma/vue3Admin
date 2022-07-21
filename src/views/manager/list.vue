<template>
  <a-card>
    <top-action :layout="['slot', 'refresh','search','searchBtn']" @onSearch='search' @onRefresh='getTableData(1)'>
      <a-button type='primary' size='small' @click='btnAddLevel'>新增</a-button>
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
        <template v-if="column.key ==='username'">
          <span class='d-flex'>
             <el-avatar shape='square' :size='40' :src='record.avatar' />
            <span class='d-flex flex-md-column' style='margin-left: 5px;'>
              <small>{{ record.username }}</small>
                <small>ID:{{ record.id }}</small>
            </span>
          </span>
        </template>
        <template v-if="column.key==='role'">
          <a-tag>{{ record.role.name }}</a-tag>
        </template>
        <template v-if="column.key==='operating'">
          <a-button type='link' @click='btnEditLevel(record.id)'>修改</a-button>
          <a-button type='link' @click='btnDelLevel(record.id)'>删除</a-button>
        </template>
        <template v-if="column.key==='status'">
          <el-switch
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
    width='600px'
    title='添加'
    placement='right'
  >
    <Form :data='formColumns' @submit='handleAddGoods' btn-title='确定' :reset='true'>
      <el-upload
        v-model:file-list='fileList'
        list-type='picture-card'
        disabled
        :on-preview='handlePictureCardPreview'

      >
        <el-icon @click='showChooseACover'>
          <Plus />
        </el-icon>
      </el-upload>
    </Form>
  </a-drawer>
  <el-dialog v-model='dialogVisibleImage'>
    <img w-full :src='dialogImageUrl' alt='Preview Image' style='width: 100%;height: 100%' />
  </el-dialog>
  <el-dialog
    v-model='dialogChooseACover'
    title='选择图片'
    width='60%'
  >
    <span>This is a message</span>
    <template #footer>
      <span class='dialog-footer'>
        <el-button @click='dialogChooseACover = false'>取消</el-button>
        <el-button type='primary' @click='dialogChooseACover = false'
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'
import API from '@/api/manager'
import { reactive, ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import Form from '@/components/common/Form'
import { formColumns } from '@/views/manager/formColumns'
import ROLEAPI from '@/api/role'

const fileList = ref([{
  name: 'food.jpeg',
  url: 'http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/62af04afe39fa.jpg'
}])
const getRoleList = async () => {
  const res = await ROLEAPI.getRoleList(1)
  formColumns.role_id.options = res.list
}

const drawerAddLevel = ref(false)
const statusModel = reactive({})
const columns = [
  {
    title: '管理员',
    key: 'username',
    dataIndex: 'username'
  },
  {
    title: '所属角色',
    dataIndex: 'role',
    key: 'role'
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
const dialogImageUrl = ref('')
const dialogVisibleImage = ref(false)
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisibleImage.value = true
}
const dialogChooseACover = ref(false)
const TableData = ref([])
const getTableData = async (page = 1, keyword = '') => {
  const res = await API.getManagerList(page, keyword)
  TableData.value = res.list
  pagination.total = res.totalCount
  for (let i = 0; i < TableData.value.length; i++) {
    statusModel[`status${TableData.value[i].id}`] = TableData.value[i].status === 1
  }
}
const showChooseACover = () => {
  dialogChooseACover.value = true
}
getTableData(1)
const handleTableChange = (pag) => {
  getTableData(pag.current)
}
const changeStatus = async (val, id) => {
  console.log(val, id)
  const status = val ? 1 : 0
  const res = await API.updateManagerStatus(id, { status })
  if (res) {
    ElNotification.success('状态更新成功！')
    await getTableData(1)
  }
}
const btnAddLevel = async () => {
  await getRoleList()
  drawerAddLevel.value = true
}
const editId = ref()
const handleAddGoods = async data => {
  const dataFrom = {
    avatar: fileList.value[0].url,
    ...data
  }
  const res = await editId.value ? API.editManager(editId.value, dataFrom) : API.addManager(dataFrom)
  if (res) {
    drawerAddLevel.value = false
    ElNotification.success('操作成功！')
    await getTableData(1)
  }
}
const btnEditLevel = async id => {
  await getRoleList()
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
      const res = await API.delManage(id)
      if (res) {
        await getTableData(1)
        ElNotification.success('删除成功！')
      }
    })
}
const search = (query) => {
  console.log(query)
  getTableData(1, query.title)
}
</script>
<style scoped lang='scss'>
</style>
