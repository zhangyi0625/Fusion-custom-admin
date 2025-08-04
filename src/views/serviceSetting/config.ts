import { CustomColumn } from '@/components/searchForm'

export const ServiceSettingForm: CustomColumn[] = [
  {
    label: '船司',
    name: 'carrier',
    formType: 'select',
    options: [],
    span: 12,
  },
  {
    label: '服务名称',
    name: 'serverName',
    formType: 'input',
    span: 12,
  },
  {
    label: '启动类型',
    name: 'startType',
    formType: 'select',
    options: [
      {
        label: '高频启动',
        value: 'HIGH_FREQ',
      },
      {
        label: '即可启动',
        value: 'IMMEDIATE',
      },
      {
        label: '关闭任务',
        value: 'SUSPEND',
      },
    ],
    span: 12,
  },
  {
    label: '主机交换机',
    name: 'mqExchange',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机地址',
    name: 'mqHost',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机密码',
    name: 'mqPassword',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机端口',
    name: 'mqPort',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机队列',
    name: 'mqQueue',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机路由件',
    name: 'mqRoutingKey',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机账号',
    name: 'mqUsername',
    formType: 'input',
    span: 12,
  },
  {
    label: '主机虚拟地址',
    name: 'mqVirtualHost',
    formType: 'input',
    span: 12,
  },
  {
    label: '细分航线',
    name: 'routeFndIds',
    formType: 'select',
    options: [],
    span: 12,
  },
]
