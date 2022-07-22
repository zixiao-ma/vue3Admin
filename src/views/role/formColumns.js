/**
 * @author MaZiXiao
 * @date 2022-07-20 18:52
 */
/* desc: "123"
name: "测试"
status: 1 */
export const formColumns = {
  name: {
    label: '角色名称',
    type: 'text',
    showLabel: true
  },
  desc: {
    label: '角色描述',
    type: 'textarea',
    showLabel: true
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
