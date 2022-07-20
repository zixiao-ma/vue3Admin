<template>
  <el-pagination
    v-model:currentPage='model.pageNum'
    v-model:page-size='model.pageSize'
    :total='props.total'
    layout='total, sizes, prev, pager, next, jumper'
    page-size='[10, 20, 30, 40]'
    @size-change='handleSizeChange'
    @current-change='handleCurrentChange'
  />
</template>

<script setup>
import { defineEmits, defineProps, reactive } from 'vue'

const emit = defineEmits(['change'])
const model = reactive({
  pageNum: 1,
  pageSize: 10
})
const props = defineProps({
  pageNum: {
    type: Number,
    required: true,
    default: 1
  },
  pageSize: {
    type: Number,
    required: true,
    default: 10
  },
  total: {
    type: Number,
    required: true,
    default: 10
  }
})
// eslint-disable-next-line vue/no-setup-props-destructure
model.pageNum = props.pageNum
// eslint-disable-next-line vue/no-setup-props-destructure
model.pageSize = props.pageSize
const handleSizeChange = (val) => {
  emit('change', model)
}
const handleCurrentChange = (val) => {
  emit('change', model)
}
</script>
<style lang='scss' scoped>

</style>
<script>
/* <pagination :page-num="pageList.page" :page-size="pageList.size" :total="pageList.total"
@change="pageChange"></pagination> */
</script>
