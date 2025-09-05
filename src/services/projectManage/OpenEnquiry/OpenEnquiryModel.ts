import type { ProductManageType } from '@/services/productManage/productManageModel'
import type { DefaultPaging } from '@/types/global'

export interface OpenEnquiryType {
  id?: string
  address: string
  area: string
  city: string
  province: string
  title: string
  estimatedAmount: string
  deadline: string
  customerName: string
  customerPhone: string
  files: string[]
  remark: string
  products: ProductManageType[]
  quotations: QuotationsType[]
  status: string | null
  createTime: string
  viewCount: string
  quotationCount: string
  confirmQuotationId: string
}

export interface OpenEnquiryParams
  extends Pick<OpenEnquiryType, 'title' | 'status'>,
    DefaultPaging {
  sort: string
  keyword: string | null
}

export interface QuotationsType {
  alternative: boolean
  amount: string
  inquiryId: string
  supplierName: string
  supplierId: string
  items: ProductManageType[]
}
