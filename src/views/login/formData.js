/**
 * @author MaZiXiao
 * @date 2022-07-15 21:08
 */
export const FormData = {
  username: {
    label: '账户',
    clearable: false,
    type: 'text',
    maxlength: 10,
    minlength: 4,
    leftIcon: 'User',
    togglePwd: true,
    placeholder: '请输入用户名',
    showLabel: false
  },
  password: {
    label: '密码',
    clearable: false,
    type: 'password',
    maxlength: 10,
    minlength: 4,
    leftIcon: 'Unlock',
    togglePwd: true,
    placeholder: '请输入密码',
    showLabel: false
  }
}
