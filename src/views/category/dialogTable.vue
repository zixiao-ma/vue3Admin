<template>
  <div class='table_box'>
    <a-table
      :row-selection='{ selectedRowKeys:state.selectedRowKeys, onChange: onSelectChange }'
      :dataSource='TableData'
      row-key='id'
      :pagination='pagination'
      :columns='columns'
      @change='handleTableChange'
      size='small'

    >
      <template #bodyCell='{ column, record }'>
        <template v-if="column.key === 'goods'">
          <div class='goods_box d-flex align-items-center'>
            <el-image style='width: 70px; height: 70px' :src='record.cover' />
            <div class='goodsInfo'>
              <p>{{ record.title }}</p>
              <p>描述：{{ record.desc }}</p>
              <p>创建时间：{{ record.create_time }}</p>
            </div>
          </div>

        </template>
        <template v-if="column.key === 'price'">
          <p><span style='color: red'>￥{{ record.min_price }}</span> | ￥{{ record.min_oprice }}</p>
        </template>
      </template>
    </a-table>
  </div>
  <div class='btns' style='text-align: center'>
    <el-button type='primary' @click='onOk'>确定</el-button>
  </div>
</template>

<script setup>
import { defineEmits, reactive, ref } from 'vue'
import { getGoodsList } from '@/api/goodsList'
import { columns } from './columns'

const emit = defineEmits(['onSubmit'])
const state = reactive({
  selectedRowKeys: []
})
const pagination = reactive({
  total: 36
})
const TableData = ref([])
/**
 * 表格多选框方法
 * @param selectedRowKeys
 */
const onSelectChange = selectedRowKeys => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys
}

const getTableData = async (page = 1) => {
  TableData.value = []
  const obj = {
    tab: 'all'
  }
  const res = await getGoodsList(obj, page)
  TableData.value = res.list
  pagination.total = res.totalCount
}
getTableData()
const handleTableChange = (pag) => {
  console.log(pag.current)
  getTableData(pag.current)
}
const onOk = () => {
  const ids = Object.values(state.selectedRowKeys)
  emit('onSubmit', ids)
}
</script>
<style lang='scss' scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-card {
  padding: 10px;
}

.ant-btn {
  margin-right: 10px;
}

.goodsInfo {
  p {
    margin: 0;
    margin-left: 5px;
    padding: 0;
    font-size: 12px;
    color: #666;
  }
}

.table_box {
  height: 400px;
  overflow: auto;
}
</style>
