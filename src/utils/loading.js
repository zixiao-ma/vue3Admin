/**
 * @author MaZiXiao
 * @date 2022-07-15 17:06
 */
/*
* @配置nprogress进度条loading
*  */
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElLoading } from 'element-plus'
// Nprogress 关闭小圆圈
Nprogress.configure({ showSpinner: false })
const nprogress = Nprogress
const elLoading = {
  loadingInstance: null,
  start() {
    if (this.loadingInstance === null) {
      this.loadingInstance = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: '#fff'
      })
    }
  },
  done() {
    if (this.loadingInstance !== null) {
      this.loadingInstance.close()
      this.loadingInstance = null
    }
  }
}
export default {
  nprogress,
  elLoading
}
