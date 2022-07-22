<template>
  <a-card>
    <div class='top'>
      <a-button type='primary' size='small' @click='addImgClassModel=true'>新增图片分类</a-button>
      <a-button type='danger' size='small' @click='uploadImgModel = true'>上传图片</a-button>
    </div>
    <el-row :gutter='20' style='margin-top: 10px'>
      <el-col :span='4'>
        <el-tabs tab-position='left' class='demo-tabs' @tab-change='changeTab' stretch>
          <el-tab-pane v-for='item in classList' :key='item.id'
          >
            <template #label>
        <span class='custom-tabs-label'>
          <span>{{ item.name }}</span>
          <span style='margin-left: 50px' @click.stop='editClassName(item.id)'><el-icon><Edit /></el-icon></span>
          <span style='margin-left: 10px' @click.stop='delTabs(item.id)'><el-icon><Close /></el-icon></span>
        </span>
            </template>
          </el-tab-pane>
        </el-tabs>
        <el-button @click='getClassList(1)'>
          <el-icon>
            <ArrowLeftBold />
          </el-icon>
        </el-button>
        <el-button @click='getClassList(2)'>
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </el-button>
      </el-col>
      <el-col :span='20'>
        <div class='imgmainbox'>
          <div class='imgbox' v-for='(item,index) in imgList' :key='item.id'>
            <div class='imgtop'>
              <img :src='item.url'>
              <p class='imgtitle'>{{ item.name }}</p>
            </div>
            <div class='imgfot d-flex justify-content-center'>
              <a-checkbox v-if='props.showCkb' style='margin-top: 5px' v-model:checked='checkboxStatus[`ckb${index}`]'
                          @change='addImgUrl(item)'></a-checkbox>
              <a-button type='link' @click='btnEditName(item)'>重命名</a-button>
              <a-button type='link' @click='delImage(item.id)'>删除</a-button>
            </div>
          </div>
        </div>
        <div class='d-flex justify-content-center align-items-center mt-2'>
          <a-pagination v-model:current='current' :defaultPageSize='8' :total='total' show-less-items />
        </div>
      </el-col>
    </el-row>
  </a-card>
  <a-modal v-model:visible='modelEditImgName' title='重命名' @ok='handleEditImgOk'>
    <a-input v-model:value='imgname'></a-input>
  </a-modal>
  <a-drawer
    v-model:visible='uploadImgModel'
    class='custom-class'
    title='上传图片'
    placement='right'
  >
    <a-upload-dragger
      name='file'
      v-model:fileList='fileList'
      :multiple='true'
    >
      <p class='ant-upload-drag-icon'>
        <inbox-outlined></inbox-outlined>
      </p>
      <p class='ant-upload-text'>Click or drag file to this area to upload</p>
      <p class='ant-upload-hint'>
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>
  </a-drawer>
  <a-drawer
    v-model:visible='addImgClassModel'
    class='custom-class'
    :title="editClassImgid?'修改分类':'新增分类'"
    placement='right'
  >
    <Form :data='formColumns' @submit='handleAddGoods' btn-title='确定' :reset='true'></Form>
  </a-drawer>
</template>

<script setup>
import { InboxOutlined } from '@ant-design/icons-vue'
import CLASSAPI from '@/api/image'
import { defineProps, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import Form from '@/components/common/Form'

const formColumns = {
  name: {
    label: '分类名称',
    type: 'text',
    showLabel: true
  },
  order: {
    label: '排序',
    type: 'number',
    showLabel: true
  }
}

const addImgClassModel = ref(false)
const uploadImgModel = ref(false)
const modelEditImgName = ref(false)
const props = defineProps({
  showCkb: {
    type: Boolean,
    default: false
  }
})
const fileList = ref([])
const checkboxStatus = reactive({})
const current = ref(1)
const total = ref(0)
const classList = ref([])
const getClassList = async (page = 1) => {
  const res = await CLASSAPI.getImageClassList(page)
  classList.value = res.list
  await changeTab(0)
}
getClassList()
const imgList = ref([])
const changeTab = async index => {
  const id = classList.value[index].id
  const res = await CLASSAPI.getImageList(id, current.value)
  console.log(res)
  imgList.value = res.list
  total.value = res.totalCount
  for (let i = 0; i < res.list.length; i++) {
    checkboxStatus[`ckb${i}`] = false
  }
  console.log(checkboxStatus)
}
const store = useStore()
const addImgUrl = (item) => {
  store.commit('image/addImgUrl', { name: item.name, url: item.url })
}
const delTabs = async (id) => {
  await CLASSAPI.deleteImageClass(id)
  await getClassList(1)
}
const delImage = async (id) => {
  await CLASSAPI.deleteimgAll(id)
}
const imgname = ref('')
const editImgId = ref()
const btnEditName = (item) => {
  modelEditImgName.value = true
  imgname.value = item.name
  editImgId.value = item.id
}
const handleEditImgOk = async () => {
  const res = await CLASSAPI.editImgName(editImgId.value, imgname.value)
  console.log(res)
  if (res) {
    modelEditImgName.value = false
    ElMessage.success('修改成功')
    await changeTab(0)
  }
}
const editClassImgid = ref('')
const handleAddGoods = async (data) => {
  const res = await editClassImgid.value ? CLASSAPI.editClassImg(editClassImgid.value, data) : CLASSAPI.addClassImg(data)
  if (res) {
    addImgClassModel.value = false
    ElMessage.success('操作成功')
    await changeTab(0)
    await getClassList(1)
  }
}
const editClassName = id => {
  addImgClassModel.value = true
  editClassImgid.value = id
}
</script>
<style lang='scss' scoped>
.ant-btn {
  margin-right: 10px;
  margin-bottom: 10px;
}

.imgbox {
  width: 220px;
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  background-color: #fff;
  overflow: hidden;

}

.imgtop {
  position: relative;
  height: 150px;

  img {
    transition: all .3s;
    width: 100%;
    height: 150px;
  }

  .imgtitle {
    position: absolute;
    bottom: -14px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    padding-left: 10px;
  }

}

.imgmainbox {
  display: flex;
  flex-wrap: wrap;
  height: 500px;
  overflow: auto;

}

.ant-btn {
  margin-bottom: 0 !important;
}
</style>
