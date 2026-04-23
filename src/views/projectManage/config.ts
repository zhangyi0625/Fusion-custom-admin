import { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const BusinessEnquirySearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'powerType',
    formType: 'normalSelect',
    customPlaceholder: '请选择目标客户',
    options: [
      {
        label: '全部客户',
        value: 1,
      },
      {
        label: '我负责的客户',
        value: 2,
      },
      {
        label: '我下属的客户',
        value: 3,
      },
    ],
    defaultValue: 1,
    selectFieldName: {
      label: 'label',
      value: 'value',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'keyword',
    customPlaceholder: '请输入项目编号或项目名称',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'customerKeyword',
    customPlaceholder: '请输入客户名称或手机号',
    formType: 'input',
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
    selectFieldName: {
      label: 'username',
      value: 'userId',
    },
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'createTime',
    formType: 'range-picker',
    customPlaceholder: ['创建开始日期', '创建结束日期'],
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
]

export const OpenEnquirySearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'title',
    customPlaceholder: '请输入询价标题',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'customerKeyword',
    customPlaceholder: '请输入客户名称或手机号',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'createTime',
    formType: 'range-picker',
    customPlaceholder: ['创建开始日期', '创建结束日期'],
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
    label: '项目名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'select',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
  },
  {
    label: '付款方',
    name: 'companyId',
    formType: 'select',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
  },
  {
    label: '预计采购日期',
    name: 'estimatedPurchaseTime',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
  {
    label: '项目类型',
    name: 'type',
    formType: 'select',
    selectFieldName: {
      label: 'label',
      value: 'value',
    },
    options: [
      {
        label: '框架合同',
        value: 'FRAME_CONTRACT',
      },
      {
        label: '即时合同',
        value: 'INSTANT_CONTRACT',
      },
    ],
    span: 12,
    isRules: true,
  },
  {
    label: '预估金额(万元)',
    name: 'price',
    formType: 'input',
    span: 12,
  },
  {
    label: '付款方式',
    name: 'payMethod',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '我司签约',
    name: 'entrustId',
    formType: 'select',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    span: 12,
    isRules: true,
  },
  {
    label: '业务员',
    name: 'salespersonId',
    formType: 'select',
    options: [],
    span: 12,
    isRules: true,
    selectFieldName: {
      label: 'username',
      value: 'userId',
    },
  },
  {
    label: '备注',
    name: 'remark',
    formType: 'textarea',
    span: 24,
  },
]

export const AddFollowRecordForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '对接方',
    name: 'supplierId',
    formType: 'treeSelect',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    isRules: true,
    span: 12,
  },
  {
    label: '跟进时间',
    name: 'followedAt',
    formType: 'date-picker',
    isRules: true,
    span: 12,
  },
  {
    label: '跟进内容',
    name: 'content',
    formType: 'textarea',
    isRules: true,
    span: 24,
  },
]

export const AddCustomerFollowRecordForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '跟进方式',
    name: 'followedMethod',
    formType: 'select',
    options: [],
    isRules: true,
    span: 12,
  },
  {
    label: '跟进时间',
    name: 'followedAt',
    formType: 'date-picker',
    isRules: true,
    span: 12,
  },
  {
    label: '跟进内容',
    name: 'content',
    formType: 'textarea',
    isRules: true,
    span: 24,
  },
]

export const ProjectStatusOptions = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '待采购',
    value: 'PENDING_PURCHASE',
  },
  {
    text: '已报价',
    value: 'QUOTED',
  },
  {
    text: '已确认',
    value: 'CONFIRMED',
  },
  {
    text: '已签合同',
    value: 'CONTRACT_SIGNED',
  },
  {
    text: '结束',
    value: 'COMPLETED',
  },
  {
    text: '中止',
    value: 'TERMINATED',
  },
]

export const OpenEnquiryStatusOptions = [
  {
    label: '全部',
    value: null,
  },
  {
    label: '待审核',
    value: 'PENDING_REVIEW',
  },
  {
    label: '待报价',
    value: 'PENDING_QUOTE',
  },
  {
    label: '已报价',
    value: 'QUOTED',
  },
  {
    label: '已结束',
    value: 'ENDED',
  },
  {
    label: '审核不通过',
    value: 'REVIEW_REJECTED',
  },
  {
    label: '已取消',
    value: 'CANCELLED',
  },
]

export const PurchaseBargainStatusOptions = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '待议价',
    value: '1',
  },
  {
    text: '确认采购价',
    value: '2',
  },
]
