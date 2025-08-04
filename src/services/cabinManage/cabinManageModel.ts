type CabinExtraInfo = {
  contractNo: string
  extentDndFreeDays: number
  withRollable: boolean
}

type PortCodeInfo = Pick<CabinTaskTemplateType, 'porCode' | 'fndCode'>

export interface CabinTaskTemplateType {
  id?: string | null | number
  porCode: string
  fndCode: string
  etd: string
  ctnQty: number
  ctnTicket: number
  priceLimit: string | number
  extra: Partial<CabinExtraInfo>
  customerId: number
  carrier: string
}

export interface CabinTaskTemplateParams extends Partial<PortCodeInfo> {
  page: number
  limit: number
  routeFndId: null | string
  etdStart?: string
  etdEnd?: string
  createdStart?: string
  createdEnd?: string
  customer?: string
  status: string
}

export interface CabinHistoryParams extends Partial<PortCodeInfo> {
  page: number
  limit: number
  router: string | number | null
  cabinStart?: string
  cabinEnd?: string
}

export interface CabinResultParams extends Partial<PortCodeInfo> {
  page: number
  limit: number
  carrier?: string | null
  customerId?: string | number | null
  cabinStart?: string
  cabinEnd?: string
}

export interface TodayPlanParams extends Partial<PortCodeInfo> {
  page: number
  limit: number
  carrier?: string | null
  routeFndId?: null | string
}
