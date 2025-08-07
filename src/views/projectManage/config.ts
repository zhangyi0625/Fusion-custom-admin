import { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const BusinessEnquirySearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'enabled',
    formType: 'normalSelect',
    customPlaceholder: '请选择目标客户',
    options: [
      {
        label: '全部客户',
        value: 'null',
      },
      {
        label: '1',
        value: 1,
      },
      {
        label: '2',
        value: 0,
      },
    ],
    defaultValue: 'null',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'project',
    customPlaceholder: '请输入项目编号或项目名称',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'name',
    customPlaceholder: '请输入客户名称或手机号',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'customer',
    customPlaceholder: '业务员',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'create',
    formType: 'date-picker',
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
]

export const AddBusinessEnquiryForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '项目编号',
    name: 'projectNo',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '项目名称',
    name: 'projectName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'select',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '付款方',
    name: 'payer',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '预计采购日期',
    name: 'expectedDate',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
  {
    label: '项目类型',
    name: 'projectType',
    formType: 'select',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '金额',
    name: 'price',
    formType: 'input',
    span: 12,
  },
  {
    label: '付款方式',
    name: 'payType',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '我司签约',
    name: 'affilateHead',
    formType: 'select',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '业务员',
    name: 'salesman',
    formType: 'select',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '备注',
    name: 'remark',
    formType: 'textarea',
    span: 24,
  },
]

export const ProjectStatusOptions = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '带采购',
    value: '1',
  },
  {
    text: '已报价',
    value: '2',
  },
  {
    text: '已确认',
    value: '3',
  },
  {
    text: '已签合同',
    value: '4',
  },
  {
    text: '结束',
    value: '5',
  },
  {
    text: '中止',
    value: '6',
  },
]
