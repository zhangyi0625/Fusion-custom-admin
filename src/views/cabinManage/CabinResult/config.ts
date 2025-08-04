import { CustomColumn } from '@/components/searchForm'

export const SelectCabinResultOptions: CustomColumn[] = [
  {
    label: '任务编号',
    name: 'no',
    formType: 'input',
    span: 6,
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'normalSelect',
    options: [],
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
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'code',
      value: 'code',
    },
    span: 6,
  },
  {
    label: '订舱时间',
    name: 'createTime',
    formType: 'date-picker',
    span: 6,
  },
]
