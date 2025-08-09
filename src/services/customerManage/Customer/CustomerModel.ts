export interface CustomerType {
  id?: string
  name: string
  phone: string
  companyId: string
  status: number | boolean
  keywords?: string
}

export interface CustomerParams extends Partial<CustomerType> {
  page: number
  limit: number
}
