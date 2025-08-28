import { DefaultPaging } from '@/types/global'

export interface CustomerType {
  id?: string
  name: string
  phone: string
  companyId: string
  status: number | boolean
  keywords?: string
}

export interface CustomerParams extends Partial<CustomerType>, DefaultPaging {}
