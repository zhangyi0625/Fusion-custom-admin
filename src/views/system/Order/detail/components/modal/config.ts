import type {
  CargoReuirementOptionsType,
  BookingFailReasonType,
} from '../../../type'

export const CargoReuirementOptions: CargoReuirementOptionsType[] = [
  {
    label: '货物品名',
    includeCarrier: 'HPL,ONE,CMA,MSK,EMC,HPLQQ',
    key: 'commodityName',
  },
  {
    label: '货物毛重',
    includeCarrier: 'HPL,ONE,CMA,MSK,EMC,HPLQQ',
    key: 'cargoWeights',
    replaceFn: (value: any) => {
      let resTxt = ''
      for (let i in value) {
        resTxt += `${i}/${value[i]}`
      }
      return !value ? '' : resTxt
    },
  },
  {
    label: '提箱时间',
    includeCarrier: 'HPL,MSK',
    key: 'pickupDay',
    replaceFn: (value: string) => `截关前${value}天`,
  },
  {
    label: '是否接受Rollable',
    includeCarrier: 'MSK',
    key: 'withRollable',
    replaceFn: (value: string) => (value ? '是' : '否'),
  },
  {
    label: '合约方',
    includeCarrier: 'MSK',
    key: 'customerCode',
    replaceFn: (value: string) => (value ? value : '我是合约方'),
  },
  {
    label: '到付预付',
    includeCarrier: 'OOCL,CMA',
    key: 'paymentTerms',
    replaceFn: (value: string) => (value === 'P' ? '预付' : '到付'),
  },
  {
    label: '是否含拖',
    includeCarrier: 'COSCO',
    key: 'boundType',
    replaceFn: (value: string) => (value ? '含拖' : '不含拖'),
  },
  {
    label: '起运地关税',
    includeCarrier: 'COSCO',
    key: 'requireObCd',
    replaceFn: (value: string) => (value ? '需要' : '不需要'),
  },
  {
    label: '是否购买保值服务',
    includeCarrier: 'COSCO',
    key: 'insured',
    replaceFn: (value: string) => (value ? '是' : '否'),
  },
  {
    label: '客户参考号',
    includeCarrier: 'HPL',
    key: 'bookingReference',
  },
  {
    label: '支付方式',
    includeCarrier: 'EMC',
    key: 'paymentType',
    replaceFn: (value: string) =>
      value === 'DAY' ? '24小时内付款' : '传统支付',
  },
  {
    label: '商品编码',
    includeCarrier: 'HPLQQ',
    key: 'goodsNo',
  },
  {
    label: '通知邮箱',
    includeCarrier: 'HPLQQ',
    key: 'notifyEmail',
  },
  {
    label: '额外目的港免箱天数',
    includeCarrier: 'MSK,CMA,ONE',
    key: 'extentDndFreeDays',
  },
]

export const BookingFailReason: BookingFailReasonType[] = [
  {
    label: '个人原因',
    reason: [
      '品名有误',
      '不允许多柜型',
      '限价过低',
      '数量上限',
      '免箱天设置错误',
    ],
  },
  {
    label: '账号原因',
    reason: ['账密有误', '资金不足'],
  },
  {
    label: '船司原因',
    reason: ['暂无对应船期', '舱位不可订购', '官网价格变动'],
  },
]
