export interface BusinessEnquiryType {
  projectNo: string
  projectName: string
  customerId: string
  payer: string
  expectedDate: string
  projectType: string
  price: number
  payType: string
  affilateHead: string
  salesman: string
  remark: string
}

export interface BusinessEnquiryParams extends BusinessEnquiryType {
  page: number
  limit: number
}
