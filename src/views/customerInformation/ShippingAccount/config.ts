import type { CustomColumn } from '@/components/searchForm'
import {
  putShippingAccountCancelSearch,
  putShippingAccountClose,
  putShippingAccountOpen,
  putShippingAccountSearch,
} from '@/services/customerInformation/shippingAccount/shippingAccountApi'

export const SelectShippingAccountOptions: CustomColumn[] = [
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
    label: '船司账号',
    name: 'account',
    formType: 'input',
    span: 6,
  },
  {
    label: '是否启用',
    name: 'isEnable',
    formType: 'normalSelect',
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
    span: 6,
  },
  {
    label: '关联服务',
    name: 'serverName',
    formType: 'normalSelect',
    options: [],
    hidden: true,
    span: 6,
  },
  {
    label: '查询状态',
    name: 'isQuery',
    formType: 'normalSelect',
    hidden: true,
    options: [
      {
        label: '是',
        value: 1,
      },
      {
        label: '否',
        value: 0,
      },
    ],
    span: 6,
  },
]

export const ShippingAccountForm: CustomColumn[] = [
  {
    label: '账号类型',
    name: 'type',
    formType: 'radio',
    options: [
      {
        label: '查询',
        value: 'QUERY',
      },
      { label: '下单', value: 'ORDER' },
    ],
    span: 12,
  },
  {
    label: '船公司',
    name: 'carrier',
    formType: 'select',
    span: 12,
    selectFileldName: {
      label: 'code',
      value: 'code',
    },
  },
  {
    label: '客户名称',
    name: 'customerId',
    formType: 'select',
    span: 12,
    selectFileldName: {
      label: 'name',
      value: 'id',
    },
  },
  {
    label: '船司账号',
    name: 'account',
    formType: 'input',
    span: 12,
  },
  {
    label: '账号抬头',
    name: 'accountHead',
    formType: 'input',
    span: 12,
  },
  {
    label: '登录密码',
    name: 'loginPassword',
    formType: 'input',
    span: 12,
  },
  {
    label: '支付密码',
    name: 'payPassword',
    formType: 'input',
    span: 12,
  },
]

export const ShippingAccountOperationBtn = {
  search: putShippingAccountSearch,
  cancelSearch: putShippingAccountCancelSearch,
  open: putShippingAccountOpen,
  close: putShippingAccountClose,
}
