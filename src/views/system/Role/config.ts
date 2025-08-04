import { CustomColumn } from '@/components/searchForm'

export const SelectRoleOptions: CustomColumn[] = [
  {
    label: '角色名称',
    name: 'roleName',
    formType: 'input',
    span: 6,
  },
  {
    label: '备注',
    name: 'comments',
    formType: 'input',
    span: 6,
  },
]
