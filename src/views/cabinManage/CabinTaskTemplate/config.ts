import { CustomColumn } from '@/components/searchForm'

export const SelectCabinTaskTemplateOptions: CustomColumn[] = [
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'normalSelect',
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
    span: 6,
  },
  {
    label: '起运港',
    name: 'porCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
  },
  {
    label: '目的港',
    name: 'fndCode',
    formType: 'normalSelect',
    options: [],
    span: 6,
  },
  {
    label: 'ETD',
    name: 'etd',
    formType: 'date-picker',
    span: 6,
  },
  {
    label: '创建时间',
    name: 'created',
    formType: 'date-picker',
    span: 6,
  },
]

export const CabinTaskTemplateStatusOptions: Pick<
  CustomColumn,
  'label' | 'name'
>[] = [
  {
    label: '未启动',
    name: 'NOT_STARTED',
  },
  {
    label: '运行中',
    name: 'RUNNING',
  },
  {
    label: '已关闭',
    name: 'CLOSED',
  },
]
