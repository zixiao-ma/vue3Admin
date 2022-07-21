/**
 * @author MaZiXiao
 * @date 2022-07-21 09:01
 */
/* avatar: "http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/62af04afe39fa.jpg"
password: "123123"
role_id: 2
status: 1
username: "测试" */
export const formColumns = {
  username: {
    label: '用户名',
    type: 'text',
    showLabel: true
  },
  password: {
    label: '密码',
    type: 'text',
    showLabel: true
  },
  avatar: {
    label: '头像',
    type: 'slot',
    showLabel: true
  },
  role_id: {
    label: '所属角色',
    clearable: true,
    type: 'select',
    placeholder: '请选择所属角色',
    showLabel: true,
    options: []
  },
  status: {
    label: '状态',
    type: 'radio',
    showLabel: true,
    options: [
      {
        label: '禁用',
        value: 0
      },
      {
        label: '启用',
        value: 1
      }
    ]
  }
}
