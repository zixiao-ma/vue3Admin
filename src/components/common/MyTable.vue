<template>
  <el-table :data='props.data' border row-key='id' style='width: 100%'>
    <template v-for='(item,index) in props.rules' :key='index+(Math.random())'>
      <el-table-column
        :key='index+(Math.random())'
        v-if="item.type==='function'"
        :label='item.label'
        :width='item.width'
      >
        <template v-slot='{row}'>
          <div v-html='item.callback&&item.callback(row)'></div>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        v-show='item.sort===index'
        :align='item.align'
        :label='item.label'
        :prop='item.prop'
        :type='item.type'
        :width="item.width + 'px'"
      >
        <template v-if='item.slot' v-slot='{ row, $index, column }'>
          <slot
            :column='column'
            :index='$index'
            :name='item.slot'
            :row='row'
          ></slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  rules: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang='scss' scoped></style>

<script>
/* <my-table :data="ArticleList" :rules="options">
<template v-slot:time="{row}">
  {{ dayjs(row.publicDate * 100 / 100).format("YYYY-MM-DD") }}
</template>
<template v-slot:footer="{row}">
  <el-button :style="{background:$store.getters.color,border:`1px solid ${$store.getters.color}`}" size="small"
             type="primary"
             @click="$router.push(`/article/${row._id}`)">
    查看
  </el-button>
  <el-button size="small" type="danger">删除</el-button>
</template>
</my-table> */
/* const options = [
  {
    label: '排名',
    prop: 'ranking',
    width: '80'
  },
  {
    label: '标题',
    prop: 'title'
  },
  {
    label: '作者',
    prop: 'author'
  },
  {
    label: '发布时间',
    prop: 'publicDate'
    slot: 'time'
  },
  {
    label: '内容简介',
    prop: 'desc'
  },
  {
    label: '操作',
    slot: 'footer'
  }
] */
</script>
