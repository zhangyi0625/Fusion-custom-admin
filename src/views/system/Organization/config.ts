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

export const AddOrganizationForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '上级机构',
    name: 'parentId',
    formType: 'select',
    span: 6,
    selectFieldName: { label: 'organizationName', value: 'organizationId' },
    options: [],
    isRules: true,
  },
  {
    label: '机构名称',
    name: 'organizationName',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '机构代码',
    name: 'organizationCode',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '机构全称',
    name: 'organizationFullName',
    formType: 'input',
    span: 6,
  },
  {
    label: '机构类型',
    name: 'organizationType',
    formType: 'input',
    span: 6,
  },
  {
    label: '机构类型名称',
    name: 'organizationTypeName',
    formType: 'input',
    span: 6,
  },
  {
    label: '排序号',
    name: 'sortNumber',
    formType: 'inputNumber',
    span: 6,
    isRules: true,
  },
  {
    label: '组织备注',
    name: 'comments',
    formType: 'textarea',
    span: 6,
  },
]
