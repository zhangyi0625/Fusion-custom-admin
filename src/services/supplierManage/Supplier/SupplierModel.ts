export interface SupplierType {
  id?: string | null
  name: string
  code: string
  contactName: string
  contactPhone: string
  logo: string
  logoName: string
  contactId?: string
}

export interface SupplierParams extends Partial<SupplierType> {
  page: number
  limit: number
}
