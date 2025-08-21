import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectUserOptions: CustomColumn[] = [
  {
    label: '账号',
    name: 'username',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '状态',
    name: 'status',
    formType: 'normalSelect',
    options: [
      {
        label: '有效',
        value: 1,
      },
      {
        label: '无效',
        value: 0,
      },
    ],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
