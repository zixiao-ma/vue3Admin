<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']" @onRefresh='getTableData'>
      <a-button type='primary' size='small' @click='btnAddCouOon'>新增</a-button>
    </top-action>
    <a-table :dataSource='tableData' :columns='columns' row-key='id'
             :pagination='pageModel' @change='handleTableChange'>
      <template #bodyCell='{ column, record }'>
        <template v-if="column.key === 'name'">
          <div class='couponCard'>
            <b>{{ record.name }}</b>
            <p>{{ record.start_time }}~{{ record.end_time }}</p>
          </div>
        </template>
        <template v-if="column.key==='operating'">
          <a-button type='link' v-if='record.status!==0' @click='btnEdit(record)'>修改</a-button>
          <a-button type='link' @click='btnDeleteCoupon(record)'>删除</a-button>
        </template>
        <template v-if="column.key==='status'">
          {{ record.status === 1 ? '已结束' : '未开始' }}
        </template>
      </template>
    </a-table>
  </a-card>
  <a-drawer
    width='700px'
    v-model:visible='drawerAddCoupon'
    class='custom-class'
    style='color: red'
    title='添加优惠券'
    placement='right'
  >
    <Form :data='formRules' @submit='submitForm' btn-title='确定' ref='addform'></Form>
  </a-drawer>
</template>
<script setup>
import TopAction from '@/components/common/TopAction'
import API from '@/api/coupon'
import { reactive, ref } from 'vue'
import { columns } from './columns'
import Form from '@/components/common/Form'
import { formRules } from './formRules'
import { ElMessageBox, ElNotification } from 'element-plus'

const drawerAddCoupon = ref(false)
const tableData = ref([])
const pageModel = reactive({
  pageNum: 1,
  total: 0
})
const btnAddCouOon = () => {
  drawerAddCoupon.value = true
}
const getTableData = async () => {
  const res = await API.getCouponList(pageModel.pageNum)
  tableData.value = res.list
  pageModel.total = res.totalCount
}
getTableData()
const handleTableChange = (pag) => {
  pageModel.pageNum = pag.current
  getTableData()
}
const addform = ref(null)
const submitForm = async (data) => {
  data.start_time = +new Date(data.start_time)
  data.end_time = +new Date(data.end_time)
  const res = await API.addCoupon(data)
  if (res) {
    drawerAddCoupon.value = false
    getTableData()
    ElNotification.success('添加成功！')
  }
}
const btnDeleteCoupon = (rowData) => {
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
      const res = await API.delCoupon(rowData.id)
      if (res) {
        await getTableData()
        ElNotification.success('删除成功！')
      }
    })
}

const btnEdit = rowData => {
  drawerAddCoupon.value = true
}
</script>
<style lang='scss' scoped>
.couponCard {
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px dashed rgb(229, 231, 235);
  padding: 5px 0 0 5px;
}
</style>
