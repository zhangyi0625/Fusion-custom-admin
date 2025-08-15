import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const SalesContractSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'keyword',
    formType: 'input',
    customPlaceholder: '请输入合同编号或合同名称',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'customerKeyword',
    formType: 'input',
    customPlaceholder: '请输入客户名称或手机号',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'projectName',
    formType: 'input',
    customPlaceholder: '请输入项目名称',
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
        label: '执行中',
        value: 'EXECUTING',
      },
      {
        label: '执行完',
        value: 'COMPLETED',
      },
      {
        label: '关闭',
        value: 'CLOSED',
      },
    ],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'salespersonId',
    customPlaceholder: '业务员',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFileldName: {
      label: 'username',
      value: 'userId',
    },
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'createTime',
    formType: 'date-picker',
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
]

export const AddSalesContractForm: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '合同编号',
    name: 'number',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '项目名称',
    name: 'salesProjectId',
    formType: 'select',
    span: 12,
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    isRules: false,
    hiddenItem: false,
  },
  {
    label: '合同名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'select',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '客户付款方',
    name: 'companyId',
    formType: 'select',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '合同类型',
    name: 'type',
    formType: 'select',
    options: [
      {
        label: '框架合同',
        value: 'FRAMEWORK',
      },
      {
        label: '即期合同',
        value: 'SPOT',
      },
    ],
    selectFileldName: {
      label: 'label',
      value: 'value',
    },
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '合同金额',
    name: 'price',
    formType: 'input',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '合同状态',
    name: 'status',
    formType: 'select',
    options: [
      {
        label: '执行中',
        value: 'EXECUTING',
      },
      {
        label: '执行完',
        value: 'COMPLETED',
      },
      {
        label: '关闭',
        value: 'CLOSED',
      },
    ],
    selectFileldName: {
      label: 'label',
      value: 'value',
    },
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
  {
    label: '业务员',
    name: 'salespersonId',
    formType: 'select',
    options: [],
    isRules: true,
    selectFileldName: {
      label: 'username',
      value: 'userId',
    },
    span: 12,
    hiddenItem: false,
  },
  {
    label: '日期',
    name: 'contractTime',
    formType: 'date-picker',
    span: 12,
    isRules: true,
    hiddenItem: false,
  },
]

export const AddSalesContractNoteForm: Omit<CustomColumn, 'selectFetch'>[] = [
  {
    label: '日期',
    name: 'invoiceDate',
    formType: 'date-picker',
    span: 24,
    hiddenItem: false,
  },
  {
    label: '款项类型',
    name: 'type',
    formType: 'select',
    span: 24,
    options: [
      {
        label: '开票',
        value: 'INVOICE',
      },
      {
        label: '收款',
        value: 'RECEIPT',
      },
    ],
    isRules: false,
    hiddenItem: false,
  },
  {
    label: '金额',
    name: 'amount',
    formType: 'input',
    span: 24,
    isRules: true,
    hiddenItem: false,
  },
]
