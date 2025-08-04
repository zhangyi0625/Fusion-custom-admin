import { CustomColumn } from '@/components/searchForm'

export const SelectCabinHistoryOptions: CustomColumn[] = [
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
    label: '细分航线',
    name: 'router',
    formType: 'normalSelect',
    options: [],
    selectFileldName: {
      label: 'routeName',
      value: 'id',
    },
    span: 6,
  },
  {
    label: '放舱日期',
    name: 'create',
    formType: 'date-picker',
    span: 6,
  },
]
