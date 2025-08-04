import type { CustomColumn } from '@/components/searchForm'
import {
  getSearchAffiliate,
  getSearchPort,
  getSearchCarrier,
} from '@/services/order'

export const CabinResultOptions: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'affiliateId',
    api: getSearchAffiliate,
    options: [],
    formType: 'select',
    span: 6,
  },
  {
    label: '船公司',
    name: 'carrier',
    api: getSearchCarrier,
    options: [],
    formType: 'select',
    span: 6,
    filterSearch: true,
  },
  {
    label: '起运港名称',
    name: 'porCode',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 6,
    tag: 'POR',
  },
  {
    label: '目的港名称',
    name: 'fnd',
    formType: 'input',
    span: 6,
  },
  {
    label: '状态',
    name: 'status',
    formType: 'select',
    span: 6,
    options: [
      {
        name: '已关联',
        id: 1,
      },
      {
        name: '未关联',
        id: 0,
      },
    ],
  },
]

export const RelevanceOrderOptions: CustomColumn[] = [
  {
    label: '目的港名称',
    name: 'fndId',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 12,
    tag: 'FND',
  },
]
