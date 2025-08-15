export interface SaleContractType {
  id?: string
  number: string
  name: string
  type: string
  status: string
  projectName: string
  customerId: string
  customerName?: string
  companyName?: string
  price: string
  contractTime: string
  remark: string
  salespersonName?: string
  createName?: string
  createTime?: string
  updateName?: string
  updateTime: string
  fileIds: string[]
  source: string
}

export interface SaleContractParams extends Partial<SaleContractType> {
  page: number
  limit: number
}

export interface SaleContractAttachmentType {
  fileId: string
  contractId: string
}

export interface SaleContractNoteType {
  invoiceDate: string
  type: string
  amount: string
  contractId: string
}
