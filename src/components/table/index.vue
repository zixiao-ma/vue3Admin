<template>
  <el-table
    :data='tableData'
    v-loading='loading'
    style='width: 100%'>
    <el-table-column
      v-if='checkbox'
      type='selection'
      width='55'>
    </el-table-column>
    <el-table-column
      v-if='index'
      type='index'
      label='序号'
      width='55'>
    </el-table-column>
    <template v-for='(item,i) in columns'>
      <el-table-column
        :key='i+(Math.random())'
        v-if="item.type==='function'"
        :label='item.label'
        :width='item.width'
      >
        <template v-slot='{row}'>
          <div v-html='item.callback&&item.callback(row)'></div>
        </template>
      </el-table-column>

      <el-table-column
        :key='i+(Math.random())'
        v-if="item.type==='slot'"
        :label='item.label'
        :width='item.width'
      >
        <template v-slot='{row}'>
          <slot :name='item.slot_name' :data='row'></slot>
        </template>
      </el-table-column>

      <el-table-column
        :key='i+(Math.random())'
        v-else
        :prop='item.prop'
        :label='item.label'
        :width='item.width'
      >
      </el-table-column>
    </template>

  </el-table>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      total: 0,
      loading: true,
      tableData: []
    }
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    checkbox: Boolean,
    index: Boolean,
    initRequest: Boolean,
    url: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'get'
    },
    params: {
      type: Object,
      default: () => {
      }
    },
    headers: {
      type: Object,
      default: () => {
      }
    },
    onConfigSuccess: {
      type: Function,
      required: true
    }
  },
  created() {
    this.initRequest && this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      const requestModel = {
        url: this.url,
        method: this.method
      }
      if (JSON.stringify(this.params) !== '{}' && this.method.toLowerCase() === 'get') {
        requestModel.params = this.params
      } else {
        requestModel.data = this.params
      }
      if (this.headers) axios.defaults.headers = this.headers
      try {
        const { data: { data } } = await axios(requestModel)
        const FinalData = this.onConfigSuccess(data)
        this.tableData = FinalData.data
        this.total = FinalData.total
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
