export type OrderDetailTimeLine = {
  title: string
  content: string
  created: string
  operator: string
}

export type OrderDetailBaseInfoType = {
  label: string
  key: string
  type: 'ALL' | 'BOOKING' | 'PREBOOKING'
  bySetting?: string
  getValue?: null | ((value: any) => void)
  value?: string
}

export type OrderStatusOptionsType<T = Record<string, any>> = {
  payStatus: T
  cancelStatus: T
  refundStatus: T
  baseStatus: T
}

type OrderAllStatusType = {
  status: string
  cancelStatus: string | null
  refundStatus: string | null
  payStatus: string | null
}

export type statusConditionType = {
  valueText: string
  titleIcon: string
  conditionFun: (status: Partial<OrderAllStatusType>) => boolean
  showBtn: boolean
  cancelBtnText?: string
  confirmBtnText?: string
  confirmHint?: string
  confirmApi?: any
}

export interface CargoReuirementOptionsType {
  label: string
  includeCarrier: string
  key: string
  value?: string | null
  replaceFn?: (type: string | any) => string
  other?: string | null
}

export type BookingFailReasonType = {
  label: string
  reason: string[]
}
