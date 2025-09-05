export type ProfileOptionsType = {
  label: string
  key: string
  isEdit: boolean
  editText?: string
  editType?: string
}

export const ProfileOptions: ProfileOptionsType[] = [
  {
    label: '公司名称',
    key: 'affilate',
    isEdit: false,
  },
  {
    label: '社会统一信用代码',
    key: 'affilate',
    isEdit: false,
  },
  {
    label: '手机号',
    key: 'affilate',
    isEdit: false,
    editType: 'editPhone',
  },
  {
    label: '登录密码',
    key: 'affilate',
    isEdit: true,
    editType: 'editPassword',
  },
]
