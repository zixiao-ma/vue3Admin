<template>
  <!--顶部tabs-->
  <el-tabs v-model='activeName' class='demo-tabs' @tab-click='handleClick'>
    <el-tab-pane label='全部' name='all'></el-tab-pane>
    <el-tab-pane label='审核中' name='checking'></el-tab-pane>
    <el-tab-pane label='出售中' name='saling'></el-tab-pane>
    <el-tab-pane label='已下架' name='off'></el-tab-pane>
    <el-tab-pane label='库存预警' name='min_stock'></el-tab-pane>
    <el-tab-pane label='回收站' name='delete'></el-tab-pane>
  </el-tabs>
  <!--头部和表格-->
  <el-card>
    <top-action :sel-options='selOptions' @onSearch='getTableData' @onRefresh='getTableData'>
      <a-button type='primary' size='small' @click='btnOpenAddGoodsDrawer'>新增</a-button>
      <a-button type='danger' size='small' @click='btnDelAll'>批量删除</a-button>
      <a-button size='small' @click='changeGoodsStatus({status:1})'>上架</a-button>
      <a-button size='small' @click='changeGoodsStatus({status:0})'>下架</a-button>
    </top-action>
    <a-table
      :row-selection='{ selectedRowKeys:state.selectedRowKeys, onChange: onSelectChange }'
      :dataSource='TableData'
      row-key='id'
      :pagination='pagination'
      :columns='columns'
      @change='handleTableChange'
      style='margin-top: 10px;'>
      <template #bodyCell='{ column, record }'>

        <template v-if="column.key === 'goods'">
          <div class='goods_box d-flex align-items-center'>
            <el-image style='width: 70px; height: 70px' :src='record.cover' />
            <div class='goodsInfo'>
              <p>{{ record.title }}</p>
              <p><span style='color: red'>￥{{ record.min_price }}</span> | ￥{{ record.min_oprice }}</p>
              <p>描述：{{ record.desc }}</p>
              <p>创建时间：{{ record.create_time }}</p>
            </div>
          </div>

        </template>
        <template v-if="column.key==='status'">
          <el-tag v-if='record.status===1'>上架</el-tag>
          <el-tag type='danger' v-else>仓库</el-tag>
        </template>
        <template v-if="column.key==='ischeck'">
          <el-tag v-if='record.status===1' type='success'>通过</el-tag>
          <el-tag type='danger' v-else>未通过</el-tag>
        </template>
        <template v-if="column.key==='operating'">
          <a-button type='link' size='small' @click='btnEditGoods(record)'>修改</a-button>
          <a-button type='link' size='small' @click='btnEditGoodsSku(record)'>商品规格</a-button>
          <a-button type='link' size='small' @click='btnSetUpACarousel(record)'>设置轮播图</a-button>
          <a-button type='link' size='small' @click='btnShowGoodsDetail(record)'>商品详情</a-button>
          <a-button type='link' size='small' @click='btnDeleteGoods(record)'>删除</a-button>
        </template>
      </template>
    </a-table>
  </el-card>
  <!-- 商品添加和编辑模态框 -->
  <a-drawer
    v-model:visible='addGoodsDrawer'
    class='custom-class'
    :title="isEdit?'编辑商品':'添加商品'"
    placement='right'
    size='large'
  >
    <Form :data='addFormData' @submit='handleAddGoods' btn-title='确定' :reset='true'>
      <el-upload
        v-model:file-list='fileList'
        list-type='picture-card'
        disabled
        :on-preview='handlePictureCardPreview'
        :on-remove='handleRemove'

      >
        <el-icon @click='showChooseACover'>
          <Plus />
        </el-icon>
      </el-upload>

    </Form>
  </a-drawer>
  <a-modal
    v-model:visible='dialogChooseACover'
    title='选择图片'
    width='1300px'
    @ok='handleOk'
  >
    <dialog-image showCkb></dialog-image>
  </a-modal>
  <a-drawer
    v-model:visible='GoodsSkuDrawer'
    class='custom-class'
    title='商品规格'
    placement='right'
    size='large'
  >
    <div class='mb-2 flex items-center text-sm'>
      <span>规格类型：</span>
      <el-radio-group v-model='skuDisplayType' class='ml-4'>
        <el-radio label='0' size='large'>单规格</el-radio>
        <el-radio label='1' size='large'>多规格</el-radio>
      </el-radio-group>
    </div>
    <Form v-if="skuDisplayType==='0'" :data='skuFormData' @submit='handleEditGoodsSku' btn-title='确定'
          :reset='true'></Form>
    <div v-else>
      <h1 style='font-size: 30px;'>不会😒😒😒😒😒😒</h1>
    </div>
  </a-drawer>
  <a-drawer
    v-model:visible='setUpACarousel'
    class='custom-class'
    title='设置轮播图'
    placement='right'
    size='large'
  >

    <el-upload
      v-model:file-list='fileListBanner'
      list-type='picture-card'
      :on-preview='handlePictureCardPreview'
      :on-remove='handleRemove'
      disabled
    >
      <el-icon @click='showChooseACover'>
        <Plus />
      </el-icon>
    </el-upload>
  </a-drawer>
  <el-dialog v-model='dialogVisibleImage'>
    <img w-full :src='dialogImageUrl' alt='Preview Image' style='width: 100%;height: 100%' />
  </el-dialog>
  <a-drawer
    v-model:visible='goodsDetailDrawer'
    class='custom-class'
    title='商品详情'
    placement='right'
    size='large'
  >
    <v-md-editor v-model='text'></v-md-editor>
    <div style='text-align: right;margin: 10px 0'>
      <el-button @click='editGoodsDetail' type='primary'>提交</el-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { reactive, ref } from 'vue'
import TopAction from '@/components/common/TopAction'
import {
  addGoods,
  apiChangeStatus,
  DeleteProductsInBulk,
  editGoodsInfo,
  editGoodsSkus,
  getClassify,
  getGoodsList
} from '@/api/goodsList'
import { columns } from '@/views/goods/columns'
import Form from '@/components/common/Form'
import { addFormData, skuFormData } from './addFormData'
import { ElMessageBox, ElNotification } from 'element-plus'
import DialogImage from '@/components/common/dialogImage'
import { useStore } from 'vuex'

/**
 * 定义响应式变量
 * @type {Ref<UnwrapRef<*[]>>}

 */
const text = ref('')
const cates = ref([])
const addGoodsDrawer = ref(false)
const goodsDetailDrawer = ref(false)
const TableData = ref([])
const activeName = ref('all')
const selOptions = ref([])
const isEdit = ref(false)
const setUpACarousel = ref(false)
const editGoodsId = ref()
const GoodsSkuDrawer = ref(false)
const skuDisplayType = ref('0')
const store = useStore()
const state = reactive({
  selectedRowKeys: []
})

const pagination = reactive({
  total: 36
})
const dialogChooseACover = ref(false)
const fileList = ref([])
const handleOk = () => {
  fileList.value = store.getters.urlList
  dialogChooseACover.value = false
  store.commit('image/removeUrl')
}
const fileListBanner = ref([])
const dialogImageUrl = ref('')
const dialogVisibleImage = ref(false)
/**
 * 表格多选框方法
 * @param selectedRowKeys
 */
const onSelectChange = selectedRowKeys => {
  console.log('selectedRowKeys changed: ', selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys
}
/**
 * 获取Select数据
 * @return {Promise<void>}
 */
const getSelectData = async () => {
  selOptions.value = await getClassify()
  addFormData.category_id.options = selOptions.value
}
getSelectData()
/**
 * 获取表格数据
 * @param data
 * @param page
 * @return {Promise<void>}
 */
const getTableData = async (data, page = 1) => {
  TableData.value = []
  const obj = {
    ...data,
    tab: activeName.value
  }
  const res = await getGoodsList(obj, page)
  TableData.value = res.list
  cates.value = res.cates
  pagination.total = res.totalCount
}
getTableData()
/**
 * 点击tab给activeName赋值
 * @param tab
 * @param event
 * @return {Promise<void>}
 */
const handleClick = async (tab, event) => {
  activeName.value = tab.props.name
  TableData.value = []
  if (activeName.value === tab.props.name) {
    await getTableData()
  }
}
/**
 * 点击tab重新获取对应数据
 * @param tab
 * @param event
 * @return {Promise<void>}
 */
const handleTableChange = (pag) => {
  console.log(pag.current)
  getTableData({ tab: activeName.value }, pag.current)
}
/**
 * 开启商品添加模态框
 */
const btnOpenAddGoodsDrawer = () => {
  fileList.value = []
  isEdit.value = false
  addGoodsDrawer.value = true
}
/**
 * 添加商品方法
 * @param data
 */
const handleAddGoods = async (data) => {
  const goodsModel = {
    ...data,
    cover: fileList.value[0].url
  }
  const res = await isEdit.value ? editGoodsInfo(goodsModel, editGoodsId.value) : addGoods(goodsModel)

  if (res) {
    getTableData()
    ElNotification.success(`${isEdit.value ? '修改' : '添加'}成功!`)
    addGoodsDrawer.value = false
  }
}
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisibleImage.value = true
}
const showChooseACover = () => {
  dialogChooseACover.value = true
}
const btnDelAll = async () => {
  try {
    const idsArray = Object.values(state.selectedRowKeys)
    const res = await DeleteProductsInBulk({ ids: idsArray })
    if (res === 'ok') {
      await getTableData()
      ElNotification.success('删除成功！')
    }
  } catch (error) {

  }
}
const changeGoodsStatus = async (data) => {
  try {
    const idsArray = Object.values(state.selectedRowKeys)
    const res = await apiChangeStatus({ ...data, ids: idsArray })
    if (typeof res === 'number') {
      await getTableData()
      ElNotification.success('操作成功！')
    }
  } catch (error) {

  }
}
const btnEditGoods = (rowData) => {
  console.log(rowData)
  fileList.value[0].url = rowData.cover
  editGoodsId.value = rowData.id
  isEdit.value = true
  addGoodsDrawer.value = true
}
const handleEditGoodsSku = async (data) => {
  try {
    const goodsModel = {
      sku_type: Number(skuDisplayType.value),
      sku_value: data
    }
    const res = await editGoodsSkus(goodsModel, editGoodsId.value)
    console.log(res)
  } catch (error) {

  }
  console.log(data)
}
const btnEditGoodsSku = (rowData) => {
  GoodsSkuDrawer.value = true
  editGoodsId.value = rowData.id
  console.log(rowData)
}
const btnSetUpACarousel = (rowData) => {
  fileListBanner.value = []
  rowData.goods_banner.forEach(item => {
    fileListBanner.value.push({
      name: item.id,
      url: item.url
    })
  })
  setUpACarousel.value = true
}
const btnShowGoodsDetail = (rowData) => {
  text.value = []
  editGoodsId.value = rowData.id
  goodsDetailDrawer.value = true
  text.value = rowData.content
}
const editGoodsDetail = async () => {
  await editGoodsInfo({ content: text.value }, editGoodsId.value)
}
const btnDeleteGoods = (rowData) => {
  ElMessageBox.confirm(
    '您确定要删除此商品吗?',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const res = await DeleteProductsInBulk({ ids: [rowData.id] })
      if (res === 'ok') {
        await getTableData()
        ElNotification.success('删除成功！')
      }
    })
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
</style>
