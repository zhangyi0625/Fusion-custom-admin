import { DefaultPaging } from '@/types/global'

export interface CustomerType {
  id?: string
  name: string
  phone: string
  companyId: string | string[]
  companyName?: string | string[]
  refCompanyName?: string
  address?: string
  source?: string
  level?: string
  remark?: string
  status: number | boolean
  keywords?: string
  projectName?: string
}

export interface CustomerParams extends Partial<CustomerType>, DefaultPaging {
  sort: string
}

export interface FollowCustomerType {
  id: string | null
  customerId: string
  followedAt: string
  followedMethod: string
  content: string
  fileId: string
}
