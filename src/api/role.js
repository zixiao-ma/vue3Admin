/**
 * @author MaZiXiao
 * @date 2022-07-21 09:09
 */
import request from '@/utils/request'

const getRoleList = (page) => {
  return request({
    url: '/admin/role/' + page,
    method: 'get'
  })
}
export default {
  getRoleList
}
