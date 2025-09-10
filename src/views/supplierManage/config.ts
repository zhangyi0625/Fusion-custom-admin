import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SupplierSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'contactKeyword',
    formType: 'input',
    customPlaceholder: '请输入联系人名称或手机号',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'name',
    formType: 'input',
    customPlaceholder: '请输入企业名称',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]

export const ContractsSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'keyword',
    formType: 'input',
    customPlaceholder: '请输入联系人名称或手机号',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'supplierId',
    formType: 'focusSelect',
    customPlaceholder: '请选择供应商名称',
    span: 6,
    hiddenItem: false,
    selectFetch: true,
    apiByUrl: '/api/business/supplier',
    apiByUrlMethod: 'get',
    setSearchKey: 'name',
    apiByUrlParams: {
      name: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    selectResultKey: 'data',
  },
]

export const AddSupplierForm: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '供应商',
    name: 'name',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '社会统一信用代码',
    name: 'code',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '主联系人',
    name: 'contactId',
    formType: 'select',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    span: 24,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'contactPhone',
    formType: 'input',
    span: 24,
    hiddenItem: false,
  },
  {
    label: '用户账号',
    name: 'username',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '用户密码',
    name: 'password',
    formType: 'input',
    span: 24,
    hiddenItem: false,
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
    label: '关联单位',
    isRules: true,
    formType: 'select',
    span: 24,
    name: 'companyId',
    options: [],
  },
  {
    label: '状态',
    isRules: true,
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

export const AddContractsForm: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '联系人',
    name: 'name',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '关联供应商',
    name: 'supplierId',
    formType: 'select',
    options: [],
    span: 24,
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    hiddenItem: true,
  },
]

export const SupplierAuditSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'name',
    formType: 'normalSelect',
    customPlaceholder: '选择状态',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
]
