/**
 * @author MaZiXiao
 * @date 2022-07-21 09:45
 */
import request from '@/utils/request'

const getImageClassList = (page) => {
  return request({
    url: '/admin/image_class/' + page,
    method: 'get'
  })
}

const getImageList = (classID, page) => {
  return request({
    url: `/admin/image_class/${classID}/image/${page}`,
    method: 'get'
  })
}
export default {
  getImageClassList,
  getImageList
}
