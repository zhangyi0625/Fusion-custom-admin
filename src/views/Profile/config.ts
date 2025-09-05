export type ProfileOptionsType = {
  label: string
  key: string
  isEdit: boolean
  editText?: string
  editType?: string
  value?: string
}

export const ProfileOptions: ProfileOptionsType[] = [
  {
    label: '公司名称',
    key: 'name',
    isEdit: false,
  },
  {
    label: '社会统一信用代码',
    key: 'code',
    isEdit: false,
  },
  {
    label: '手机号',
    key: 'contactPhone',
    isEdit: false,
    editType: 'editPhone',
  },
  {
    label: '登录密码',
    key: 'password',
    isEdit: true,
    editType: 'editPassword',
  },
]
