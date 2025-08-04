import type { CustomColumn } from '@/components/searchForm'
import {
  getSearchAffiliate,
  getSearchCustomer,
  getSearchPort,
  postBookingFinish,
  postBookingRefund,
  postBookingSuccess,
  postRejectCancelApply,
  postStartBooking,
} from '@/services/order'
import type {
  OrderDetailBaseInfoType,
  OrderStatusOptionsType,
  statusConditionType,
} from './type'
import { formatTime } from '@/utils/format'

export const SelectOrderOptions: CustomColumn[] = [
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
    name: 'fndCode',
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
    publicSettingKey: 'frtOrderStatus',
  },
  {
    label: '订单分类',
    name: 'type',
    formType: 'select',
    span: 6,
    publicSettingKey: 'serviceType',
  },
  {
    label: '舱位分类',
    name: 'productChannel',
    formType: 'select',
    span: 6,
    publicSettingKey: 'productChannel',
  },
  {
    label: '取消状态',
    name: 'cancelStatus',
    formType: 'select',
    span: 6,
    publicSettingKey: 'frtOrderCancel',
  },
]

export const OrderDetailBaseInfo: OrderDetailBaseInfoType[] = [
  {
    label: '订单编号',
    key: 'orderNo',
    type: 'ALL',
  },
  {
    label: '船公司',
    key: 'carrier',
    type: 'ALL',
  },
  {
    label: '订单创建时间',
    key: 'createTime',
    type: 'ALL',
    getValue: (value) => formatTime(value, 'Y/M/D h:m:s'),
  },
  {
    label: '起运港',
    key: 'por',
    type: 'ALL',
    getValue: (value) =>
      value?.name + '--' + value?.localName + '--' + value?.countryLocalName,
  },
  {
    label: 'ETD',
    key: 'bookingInfo',
    type: 'BOOKING',
    getValue: (value) => formatTime(value?.etd, 'Y/M/D h:m'),
  },
  {
    label: '开航起始时间',
    key: 'bookingInfo',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.etdStart, 'Y-M-D h:m'),
  },
  {
    label: '订单分类',
    key: 'type',
    type: 'ALL',
    bySetting: 'serviceType',
  },
  {
    label: '目的港',
    key: 'fnd',
    type: 'ALL',
    getValue: (value) =>
      value?.name + '--' + value?.localName + '--' + value?.countryLocalName,
  },
  {
    label: 'ETA',
    key: 'bookingInfo',
    type: 'BOOKING',
    getValue: (value) => formatTime(value?.eta, 'Y/M/D h:m'),
  },
  {
    label: '开航截止时间',
    key: 'bookingInfo',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.etdStart, 'Y-M-D h:m'),
  },
  {
    label: '舱位分类',
    key: 'productChannel',
    type: 'ALL',
    bySetting: 'productChannel',
  },
  {
    label: '船名航次',
    key: 'bookingInfo',
    type: 'ALL',
    getValue: (value) =>
      value?.vesselName ? value?.vesselName + ' / ' + value?.voyNo : '/',
  },
  {
    label: '预定截止时间',
    key: 'deadline',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value, 'Y-M-D h:m'),
  },
  {
    label: '条款',
    key: 'bookingInfo',
    type: 'ALL',
    getValue: (value) => value?.transClause ?? '',
  },
  {
    label: '预定交货时间',
    key: 'bookingInfo',
    type: 'BOOKING',
    getValue: (value) => formatTime(value?.validTo, 'Y-M-D h:m'),
  },
  {
    label: '直航/中转',
    key: 'bookingInfo',
    type: 'BOOKING',
    getValue: (value) => (value?.transitNum == '0' ? '直航' : '中转'),
  },
  {
    label: '是否中转',
    key: 'bookingInfo',
    type: 'PREBOOKING',
    getValue: (value) => (value ? '是' : '否'),
  },
  {
    label: '预定交货期',
    key: 'bookingInfo',
    type: 'BOOKING',
    getValue: (value) => (value?.voyDays ? value?.voyDays + '天' : ''),
  },
  {
    label: '所属公司',
    key: 'affiliateName',
    type: 'ALL',
  },
  {
    label: '订舱账号',
    key: 'orderCarrierAccounts',
    type: 'ALL',
    getValue: (value) => (value ? '使用自有船司账号' : '使用第三方账号'),
  },
  {
    label: '货物要求',
    key: 'cargo',
    type: 'ALL',
    getValue: () => '查看',
  },
  {
    label: '操作人',
    key: 'customerName',
    type: 'ALL',
  },
]

export const OrderDetailAreaInfo: Omit<OrderDetailBaseInfoType, 'type'>[] = [
  {
    label: '船公司',
    key: 'carrier',
  },
  {
    label: '创建时间',
    key: 'createTime',
    getValue: (value) => formatTime(value, 'Y/M/D h:m:s'),
  },
  {
    label: '起运港',
    key: 'por',
    getValue: (value) => value?.name + '-' + value?.localName,
  },
  {
    label: '最近更新时间',
    key: 'modifyTime',
    getValue: (value) => formatTime(value, 'Y/M/D h:m:s'),
  },
  {
    label: '目的港',
    key: 'fnd',
    getValue: (value) => value?.name + '-' + value?.localName,
  },
  {
    label: '库存',
    key: 'inventory',
    getValue: () => '--',
  },
  {
    label: '是否中转',
    key: 'bookingInfo',
    getValue: (value) => (value ? '是' : '否'),
  },
  {
    label: '条款',
    key: 'bookingInfo',
    getValue: (value) => value?.transClause ?? '',
  },
  {
    label: '起运日期',
    key: 'bookingInfo',
    getValue: (value) => formatTime(value?.etd, 'Y/M/D'),
  },
  {
    label: '船名航次',
    key: 'bookingInfo',
    getValue: (value) =>
      value?.vesselName ? value?.vesselName + '/' + value?.voyNo : '/',
  },
  {
    label: '卸港日期',
    key: 'bookingInfo',
    getValue: (value) => formatTime(value?.eta, 'Y/M/D h:m'),
  },
  {
    label: '运价有效期',
    key: 'bookingInfo',
    getValue: (value) =>
      formatTime(value?.validFrom, 'Y/M/D') +
      '至' +
      formatTime(value?.validTo, 'Y/M/D'),
  },
  {
    label: '预定交货期',
    key: 'bookingInfo',
    getValue: (value) => value?.voyDays ?? '',
  },
  {
    label: '费用范围',
    key: 'range',
    getValue: () => '--',
  },
  {
    label: '航程',
    key: 'bookingInfo',
    getValue: (value) => value?.voyDays ?? '',
  },
  {
    label: '',
    key: 'down',
  },
]

export const ORDER: string[] = [
  '20GP',
  '40GP',
  '40HQ',
  '45HQ',
  '20RF',
  '40RF',
  '40RQ',
  '20NOR',
  '40NOR',
]

export const OrderStatusOptions: OrderStatusOptionsType = {
  payStatus: {
    UNPAID: '待支付',
    // PAID: "已支付"
  },
  cancelStatus: {
    INITIATE: '提交申请',
    PASS: '通过申请',
    FORBID: '拒绝申请',
  },
  refundStatus: {
    SUCCESS: '退款成功',
  },
  baseStatus: {
    SUBMIT: '待支付',
    REVIEW: '待审核',
    PREPARE: '预备订舱',
    RUNNING: '订舱中',
    SUCCESS: '订舱成功',
    FINISH: '已完成',
    CLOSURE: '订单关闭',
    VIOLATED: '执行违约',
    FAIL: '订舱失败',
  },
}

export const statusAllList: statusConditionType[] = [
  {
    valueText: '待支付',
    titleIcon: 'unpaid',
    conditionFun: (status) =>
      status.status !== 'CLOSURE' && status.payStatus === 'UNPAID',
    showBtn: false,
  },
  {
    valueText: '待审核',
    titleIcon: 'checkPending',
    conditionFun: (status) => status.status === 'REVIEW',
    showBtn: true,
    cancelBtnText: '取消订舱',
    confirmBtnText: '订舱中',
    confirmHint: '确认更改状态为订舱中',
    confirmApi: postStartBooking,
  },
  {
    valueText: '已取消，支付超时',
    titleIcon: 'checkPending',
    conditionFun: (status) =>
      status.status === 'CLOSURE' && status.payStatus === 'UNPAID',
    showBtn: false,
  },
  {
    valueText: '预备订舱',
    titleIcon: 'prepareBooking',
    conditionFun: (status) => status.status === 'PREPARE',
    showBtn: true,
    cancelBtnText: '取消订舱',
    confirmBtnText: '启动订舱',
    confirmHint: '确认更改为自动订舱、自动预定',
    confirmApi: postStartBooking,
  },
  {
    valueText: '订舱中',
    titleIcon: 'prepareBooking',
    conditionFun: (status) =>
      status.status === 'RUNNING' &&
      (status.cancelStatus === 'FORBID' || !status.cancelStatus),
    showBtn: true,
    cancelBtnText: '取消订舱',
    confirmBtnText: '订舱成功',
    confirmHint:
      '此操作将扣除用户服务费，并微信推送用户上传托书，是否确认已订到舱位',
    confirmApi: postBookingSuccess,
  },
  {
    valueText: '订舱中，申请取消',
    titleIcon: 'applyCancel',
    conditionFun: (status) =>
      status.status === 'RUNNING' && status.cancelStatus === 'INITIATE',
    showBtn: false,
  },
  {
    valueText: '订舱成功',
    titleIcon: 'success',
    conditionFun: (status) =>
      status.status === 'SUCCESS' &&
      (status.cancelStatus === 'FORBID' || !status.cancelStatus),
    showBtn: true,
    cancelBtnText: '订单执行违约',
    confirmBtnText: '订单执行结束',
    confirmHint: '此操作将释放用户全部服务费，是否确认',
    confirmApi: postBookingFinish,
  },
  {
    valueText: '订舱成功，申请取消',
    titleIcon: 'applyCancel',
    conditionFun: (status) =>
      status.status === 'SUCCESS' && status.cancelStatus === 'INITIATE',
    showBtn: false,
    cancelBtnText: '同意取消',
    confirmBtnText: '拒绝取消',
    confirmApi: postRejectCancelApply,
  },
  {
    valueText: '已完成',
    titleIcon: 'finish',
    conditionFun: (status) =>
      status.status === 'FINISH' &&
      (status.cancelStatus === 'FORBID' ||
        status.cancelStatus === 'PASS' ||
        !status.cancelStatus),
    showBtn: false,
  },
  {
    valueText: '已取消，未退款',
    titleIcon: 'cancel',
    conditionFun: (status) =>
      status.status === 'CLOSURE' && status.refundStatus === 'ABNORMAL',
    showBtn: false,
  },
  {
    valueText: '已取消，退款成功',
    titleIcon: 'cancel',
    conditionFun: (status) =>
      status.status === 'CLOSURE' && status.refundStatus === 'SUCCESS',
    showBtn: false,
  },
  {
    valueText: '订舱失败，退款成功',
    titleIcon: 'cancel',
    conditionFun: (status) =>
      status.status === 'FAIL' && status.refundStatus === 'SUCCESS',
    showBtn: false,
  },
  {
    valueText: '订单执行违约',
    titleIcon: 'execute',
    conditionFun: (status) =>
      (status.status === 'VIOLATED' && status.cancelStatus === 'FORBID') ||
      (status.status === 'VIOLATED' && status.cancelStatus === 'PASS'),
    showBtn: false,
  },
  {
    valueText: '退单中',
    titleIcon: 'applyCancel',
    conditionFun: (status) =>
      status.status === 'REFUND' && status.cancelStatus === 'PASS',
    showBtn: true,
    cancelBtnText: '订单执行违约',
    confirmBtnText: '订单执行退款',
    confirmHint: '此操作将退还用户服务费，并释放全部保证金',
    confirmApi: postBookingRefund,
  },
  {
    valueText: '订舱失败',
    titleIcon: 'cancel',
    conditionFun: (status) => status.status === 'FAIL',
    showBtn: false,
  },
]
