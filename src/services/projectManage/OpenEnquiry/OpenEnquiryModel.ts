import { DefaultPaging } from '@/types/global'

export interface OpenEnquiryType {
  title: string
  price: string
  customerId: string
  customerName: string
  status: string | null
  phone: string
  city: string
  createTime: string
  deadTime: string
  remark: string
}

export interface openEnquiryParams extends DefaultPaging {
  sort: string
  keyword: string
}
