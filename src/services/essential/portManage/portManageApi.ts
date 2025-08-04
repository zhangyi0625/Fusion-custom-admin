export interface PortManageType {
  id?: string | null
  cnName: string
  countryCode: string
  countryId: string
  enName: string
  code: string
  name: string
  isPor: number | boolean
  isFnd: number | boolean
  isPopularity: number
  parentRouteId: string
  routeId: string
  enabled: boolean | number
}

export interface PortManageParams
  extends Partial<
    Pick<PortManageType, 'code' | 'name' | 'isPor' | 'isFnd' | 'isPopularity'>
  > {
  page: number
  limit: number
}
