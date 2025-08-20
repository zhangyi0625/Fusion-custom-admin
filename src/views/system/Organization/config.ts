import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SelectOrganizationOptions: CustomColumn[] = [
  {
    label: '机构名称',
    name: 'organizationName',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
