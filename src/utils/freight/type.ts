export interface AdditionalColumnType<T = string> {
  blPrice?: T
  isIncludeTotal?: T
  ctn20GP?: T
  ctn40GP?: T
  ctn40HQ?: T
  ctn40RQ?: T
  ctn45HQ?: T
  chargeName?: T
  chargeType?: T
  currency: T
  is?: T
  [index: number]: T
  [key: string]: any
}

export type DDPriceListType = {
  id: string
  carrier: string
  file: string
  url: string
  fileUrl: string
  actualFilePath: string
}

export type DDPriceList = {
  pol: DDPriceListType
  pod: DDPriceListType
}

export interface AdditionalTableData {
  key: string
  value: AdditionalColumnType[] & DDPriceList[] & { [key: string]: any }
  /** 默认不计算目的港费用、其他费用 */
  isCalculate: boolean
}

export interface AdditionalChargesModule<T = AdditionalColumnType> {
  /** 基本海运费 */
  oceanBase: T[]
  /** 海运附加费 */
  oceanFreight: T[]
  /** 起运港费用 */
  porPriceList: T[]
  /** 目的港费用 */
  fndPriceList: T[]
  /** 其他费用 */
  otherPriceList: T[]
  /** D&D费用 */
  ddPriceList: Partial<DDPriceList>
  [key: string]: any
}

export interface CabinDetailForm<T = any> {
  /** 舱位详情数据 */
  cabinDetail: T
  /** 系统公共数据 */
  publicSetting: T
  /** 下单账号数据 */
  orderAccount: T[]
  /** TEU */
  teuAccount: T[]
  /** 汇率 */
  exchangeRate: T[]
  /** 标准订舱费 */
  serviceFeeList: T[]
  /** 报价单 */
  copyForm: T
  /** 可下单箱型(OOCL、COSCO) */
  isOrderShipping: T[]
  /** 船公司账号数据 */
  companyList: T[]
}

export type CostDetailType = {
  chargeCode: string | null
  chargeName: string
  chargeTag: string | null
  chargeType: string
  costCategory: string
  currency: string
  included: boolean | null
  paymentTerms: string | null
  price: string
  showOnly: boolean | null
}

export type DndPriceType = {
  costCategory: string
  costDetail: string
  currency: string
  dayNum: number
  price: string
  unit: string
} & { showDayNum?: string; copyDayNum?: number }

export interface FreightPriceListType {
  count: number
  basePrice: number
  costDetailList: CostDetailType[]
  ctnType: string
  currency: string
  dndDetailList: DndPriceType[]
  inventory: string | number
  productId: string
  totalPrice: number
}

export type FreightBoxFeeType = {
  account: FreightPriceListType[]
  bond: number
  coupon: number
  currency: string
  serviceFeeId?: number | null
  standard: number
  unitPrice?: number
  price: any
}
