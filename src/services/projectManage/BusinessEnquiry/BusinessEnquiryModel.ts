export interface BusinessEnquiryType {
  number: string
  name: string
  customerId: string
  customerName: string
  companyId: string
  companyName: string
  estimatedPurchaseTime: string
  type: 'FRAME_CONTRACT' | 'INSTANT_CONTRACT'
  price: number
  payMethod: string
  entrustId: string
  salespersonId: string
  remark: string
  isInquiry: number | boolean
  status: string | null
  createName: string
  createTime: string
  entrustName: string
}

export interface BusinessEnquiryParams extends Partial<BusinessEnquiryType> {
  page: number
  limit: number
  customerKeyword: string | null
  keyword: string | null
}

export interface BussinesOperationRecordType {
  createName: string
  createTime: string
  content: string
}

export interface BussinesEnquiryProductType {
  id?: string
  productModel: string
  productName: string
  productSpec: string
  productUnit: string
  qty: number
  projectId?: string
}

export interface BussinesFollowRecordType {
  id?: string
  projectId: string
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
}

export interface BussinesEnquiryDownloadType {
  id: string
  modifyReason?: string
  products: BussinesEnquiryProduct[]
}

export interface BussinesEnquiryImportType {
  id: string
  inquiryFile: string
  products: BussinesEnquiryProduct[]
}
