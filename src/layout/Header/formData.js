/**
 * @author MaZiXiao
 * @date 2022-07-15 21:08
 */
export const FormData = {
  oldPassword: {
    label: '旧密码',
    clearable: false,
    type: 'text',
    maxlength: 10,
    minlength: 4,
    placeholder: '请输入旧密码',
    showLabel: true
  },
  newPassword: {
    label: '新密码',
    clearable: false,
    type: 'text',
    maxlength: 10,
    minlength: 4,
    placeholder: '请输入新密码',
    showLabel: true
  },
  confirmPassword: {
    label: '确认密码',
    clearable: false,
    type: 'text',
    maxlength: 10,
    minlength: 4,
    placeholder: '请再一次输入密码',
    showLabel: true
  }
}
