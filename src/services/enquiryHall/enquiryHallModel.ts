import { DefaultPaging } from '@/types/global'
import { BussinesEnquiryProduct } from '../projectManage/BusinessEnquiry/BusinessEnquiryModel'

export interface EnquiryHallItemType {
  id?: string | null
  address: string
  area: string
  city: string
  province: string
  title: string
  estimatedAmount: string
  deadline: string
  files?: string[]
  remark: string
  products: BussinesEnquiryProduct[]
  status?: string
  createTime?: string
  quotations: any
  viewCount?: string
  quotationCount?: string
  confirmQuotationId?: string
}

export interface EnquiryHallItemParams
  extends Pick<EnquiryHallItemType, 'address'>,
    DefaultPaging {
  sort: string
}
