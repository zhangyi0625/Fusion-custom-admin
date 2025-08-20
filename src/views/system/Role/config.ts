import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectRoleOptions: CustomColumn[] = [
  {
    label: '角色名称',
    name: 'roleName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '备注',
    name: 'comments',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
