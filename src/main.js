/**
 * @author MaZiXiao
 * @date 2022-07-15 17:06
 */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import installIcons from '@/icons'
import './styles/bootstrap.min.css'
import './styles/reset.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/permission/pagePermission'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

VMdEditor.use(githubTheme)

const app = createApp(App)
installIcons(app)
app.use(VMdEditor)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(store).use(router).use(ElementPlus).use(Antd).mount('#app')
