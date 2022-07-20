<template>
  <el-row :gutter='20'>
    <el-col :span='8'>
      <span class='title' v-if="showLayout('search')">关键词</span>
      <a-input v-model:value='keyword' placeholder='输入名称' v-if="showLayout('search')" />
    </el-col>
    <el-col :span='8'>
      <span class='title' v-if="showLayout('select')">分类</span>
      <a-select
        ref='select'
        v-model:value='selectValue'
        style='width: 120px'
        v-if="showLayout('select')"
      >
        <a-select-option :value='item.id' :key='index' v-for='(item,index) in props.selOptions'>{{ item.name }}
        </a-select-option>
      </a-select>
    </el-col>
    <el-col :span='4'>
    </el-col>
    <el-col :span='4'>
      <a-button size='small' type='primary' @click='search' v-if="showLayout('searchBtn')">搜索</a-button>
      <a-button size='small' @click='resetForm' v-if="showLayout('searchBtn')">重置</a-button>
      <a-button size='small' @click='showSelect=!showSelect' v-if="showLayout('searchBtn')">{{ showSelect ? '收起' : '展开'
        }}
      </a-button>
    </el-col>
  </el-row>
  <el-row :gutter='20' style='margin-top: 10px'>
    <el-col :span='6'>
      <slot v-if="showLayout('slot')&& showSelect"></slot>
    </el-col>
    <el-col :span='16'>

    </el-col>
    <el-col :span='2'>
      <el-tooltip
        v-if="showLayout('refresh') && showSelect"
        class='box-item'
        effect='dark'
        content='刷新数据'
        placement='top'
      >
        <el-icon style='font-size: 20px;' @click='handleRefresh'>
          <Refresh />
        </el-icon>
      </el-tooltip>
    </el-col>
  </el-row>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue'

const emit = defineEmits(['onSearch', 'onRefresh'])
const props = defineProps({
  selOptions: {
    type: Object,
    default: () => {
    }
  },
  layout: {
    /* ['search', 'select', 'searchBtn', 'slot', 'refresh'] */
    type: Array,
    default: () => ['search', 'select', 'searchBtn', 'slot', 'refresh']
  }
})

const showSelect = ref(true)
const keyword = ref('')
const selectValue = ref('选择分类')
const resetForm = () => {
  keyword.value = ''
  selectValue.value = ''
}
const getQueryModel = () => {
  if (keyword.value && selectValue.value) {
    return {
      title: keyword.value || '',
      category_id: selectValue.value || ''
    }
  } else {
    return ''
  }
}
const search = () => {
  const queryModel = getQueryModel()
  emit('onSearch', queryModel)
}
const handleRefresh = () => {
  const queryModel = getQueryModel()
  emit('onRefresh', queryModel)
}
const showLayout = (type) => {
  return props.layout.includes(type)
}
</script>
<style lang='scss' scoped>
.ant-input {
  width: 300px;
}

.title {
  margin-right: 10px;
}

.ant-btn {
  margin-right: 10px;
}
</style>
