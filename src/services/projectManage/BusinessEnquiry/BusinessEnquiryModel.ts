import { DefaultPaging } from '@/types/global'
import { MakeQuotationTableType } from '../SaleProject/SaleProjectModel'

export interface BusinessEnquiryType {
  number: string
  name: string
  customerId: string
  customerName: string
  companyId: string
  companyName: string
  customerPhone: string
  estimatedPurchaseTime: string
  type: 'FRAME_CONTRACT' | 'INSTANT_CONTRACT'
  price: number
  payMethod: string
  entrustId: string
  salespersonId: string
  remark: string
  isInquiry: boolean
  status: string | null
  createName: string
  createTime: string
  entrustName: string
  confirmSupplierId: string | null
  salespersonName: string
  copperPrice: string
}

export interface BusinessEnquiryParams
  extends Partial<BusinessEnquiryType>,
    DefaultPaging {
  sort: string
  // customerKeyword: string | null
  powerType: number | string
  keyword: string | null
}

export interface BussinesOperationRecordType {
  createName: string
  createTime: string
  content: string
}

export interface BussinesEnquiryRecordType extends BussinesOperationRecordType {
  isInquery: boolean
  fileId: string
  fileName: string
}

export interface BussinesEnquiryProductType {
  id?: string | null
  productModel: string
  productName: string
  productSpec: string
  productUnit: string
  qty: number
  projectId?: string
  productId?: string
}

export interface BussinesFollowRecordType {
  id?: string
  projectId: string
  supplierId: string
  customerId: string
  followedAt: string
  content: string
  fileId: string
  fileName: string
}

export interface BussinesSupplierType {
  id?: string
  projectId: string
  supplierId: string
}

export interface BussinesEnquiryProduct extends BussinesEnquiryProductType {
  adjAmount?: number | string
  adjPrice?: number | string
  amount: string
  price: string
  inquiryNumber?: string
}

export interface BussinesEnquiryDownloadType {
  id: string
  modifyReason?: string
  products: MakeQuotationTableType[]
}

export interface BussinesEnquiryImportType {
  id: string
  inquiryFile: string
  inquiryNumber: string
  products: BussinesEnquiryProduct[]
}
