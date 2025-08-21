import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export const ProductSearchColumns: CustomColumn[] = [
  {
    label: null,
    name: 'model',
    formType: 'normalSelect',
    customPlaceholder: '产品型号',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'name',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'spec',
    formType: 'normalSelect',
    customPlaceholder: '产品规格',
    options: [],
    selectFileldName: {
      label: 'name',
      value: 'name',
    },
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'volt',
    formType: 'normalSelect',
    customPlaceholder: '产品电压',
    options: [],
    selectFetch: false,
    selectFileldName: {
      label: 'name',
      value: 'name',
    },
    span: 6,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'status',
    customPlaceholder: '产品状态',
    options: [
      {
        label: '启用',
        value: 1,
      },
      {
        label: '不启用',
        value: 0,
      },
    ],
    formType: 'normalSelect',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: null,
    name: 'keyword',
    formType: 'input',
    customPlaceholder: '请输入拼音码或产品名称',
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
]

export const AddProductForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '产品名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '拼音码',
    name: 'pinyin',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '产品型号',
    name: 'model',
    formType: 'normalSelect',
    span: 12,
    options: [],
    isRules: true,
  },
  {
    label: '产品电压',
    name: 'volt',
    formType: 'normalSelect',
    options: [],
    span: 12,
    isRules: true,
  },
  {
    label: '产品规格',
    name: 'spec',
    formType: 'normalSelect',
    span: 12,
    options: [],
    isRules: true,
  },
  {
    label: '单位',
    name: 'unit',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '备注',
    name: 'remark',
    formType: 'textarea',
    span: 24,
  },
  {
    label: '状态',
    isRules: true,
    formType: 'radio',
    span: 12,
    name: 'status',
    options: [
      {
        label: '启用',
        value: 1,
      },
      {
        label: '不启用',
        value: 0,
      },
    ],
  },
]
