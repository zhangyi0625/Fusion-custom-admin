import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const PayerUnitSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'name',
    formType: 'input',
    customPlaceholder: '请输入单位名称',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: null,
    name: 'status',
    formType: 'normalSelect',
    customPlaceholder: '请选择状态',
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

export const CustomerSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'keyword',
    formType: 'input',
    customPlaceholder: '请输入客户名称或手机号',
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
  {
    label: null,
    name: 'companyName',
    formType: 'input',
    customPlaceholder: '请输入单位名称',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'status',
    formType: 'normalSelect',
    customPlaceholder: '请选择状态',
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
  {
    label: null,
    name: 'level',
    formType: 'normalSelect',
    customPlaceholder: '请选择客户等级',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]

export const AddPayerUnitForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '单位名称',
    name: 'name',
    formType: 'input',
    span: 24,
    isRules: true,
  },
  {
    label: '社会统一信用代码',
    name: 'code',
    formType: 'input',
    span: 24,
    isRules: true,
  },
  {
    label: '状态',
    isRules: false,
    formType: 'radio',
    span: 24,
    name: 'status',
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
  },
]

export const AddCustomerForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '客户名称',
    name: 'name',
    formType: 'input',
    span: 24,
    isRules: true,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 24,
    isRules: true,
  },
  {
    label: '单位名称',
    formType: 'select',
    span: 24,
    name: 'companyId',
    options: [],
  },
  {
    label: '客户来源',
    formType: 'select',
    span: 24,
    name: 'source',
    options: [],
  },
  {
    label: '客户级别',
    formType: 'select',
    span: 24,
    name: 'level',
    options: [],
  },
  {
    label: '项目名称',
    name: 'projectName',
    formType: 'input',
    customPlaceholder: '请输入项目名称',
    span: 24,
  },
  {
    label: '备注',
    name: 'remark',
    formType: 'textarea',
    customPlaceholder: '请输入备注信息',
    span: 24,
  },
  {
    label: '地址',
    name: 'address',
    formType: 'textarea',
    customPlaceholder: '请输入客户地址信息',
    span: 24,
  },
  {
    label: '状态',
    formType: 'radio',
    isRules: false,
    span: 24,
    name: 'status',
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
  },
]
