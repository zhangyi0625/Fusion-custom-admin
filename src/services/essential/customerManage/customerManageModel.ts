export interface CustomerManageType {
  id?: string | null
  name: string
  shortName: string
  socialCode: string
}

export interface CustomerManageParams {
  name: string | null
  page: number
  limit: number
}
