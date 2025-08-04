import type { CustomColumn } from '@/components/searchForm'
import {
  getSearchAffiliate,
  getSearchCarrier,
  getSearchCustomer,
  getSearchPort,
} from '@/services/order'

export const SelectFastOrderOptions: CustomColumn[] = [
  {
    label: '订单号',
    name: 'orderNo',
    formType: 'input',
    span: 6,
  },
  {
    label: '公司名称',
    name: 'affiliateId',
    api: getSearchAffiliate,
    options: [],
    formType: 'select',
    span: 6,
  },
  {
    label: '用户名',
    name: 'customerId',
    api: getSearchCustomer,
    options: [],
    formType: 'input',
    span: 6,
  },
  {
    label: '订单创建时间',
    name: 'date-picker',
    formType: 'date-picker',
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
    name: 'porId',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 6,
    tag: 'POR',
  },
  {
    label: '目的港名称',
    name: 'fndId',
    api: getSearchPort,
    options: [],
    formType: 'select',
    span: 6,
    tag: 'FND',
  },
  {
    label: '订单状态',
    name: 'status',
    formType: 'select',
    span: 6,
    options: [
      {
        id: 'PENDING',
        name: '预定中',
      },
      {
        id: 'PREPARING',
        name: '预定中',
      },
      {
        id: 'PREPARED',
        name: '预定成功',
      },
      {
        id: 'FAILED',
        name: '预定失败',
      },
      {
        id: 'CANCELLED',
        name: '取消预订',
      },
      {
        id: 'CANCELLING',
        name: '取消申请中',
      },
    ],
  },
  {
    label: '订单来源',
    name: 'source',
    formType: 'select',
    span: 6,
    options: [
      {
        id: 'API_YDATA',
        name: '壹沓',
      },
      {
        id: 'WEB',
        name: '网页',
      },
      {
        id: 'APP',
        name: '小程序',
      },
    ],
  },
]
