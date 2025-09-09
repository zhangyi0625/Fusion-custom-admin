import { DefaultPaging } from '@/types/global'
import { BussinesEnquiryProduct } from '../projectManage/BusinessEnquiry/BusinessEnquiryModel'

export interface EnquiryHallItemType {
  id?: string | null
  address: string
  area: string | null
  city: string | null
  province: string | null
  title: string
  estimatedAmount: string
  deadline: string
  files?: string[]
  remark: string
  products: BussinesEnquiryProduct[]
  status?: string
  createTime?: string
  customerPhone: string
  quotations: any
  viewCount?: string
  quotationCount?: string
  confirmQuotationId?: string
}

export interface EnquiryHallItemParams
  extends Partial<Pick<EnquiryHallItemType, 'province' | 'area' | 'city'>>,
    DefaultPaging {
  sort: string
}
