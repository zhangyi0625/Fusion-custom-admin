import { DefaultPaging } from '@/types/global'

export interface PurchaseContractType {
  id?: string
  contractNo: string
  projectNo: string
  projectName: string
  customerId: string
  payer: string
  contractType: string
  contractPrice: string
  contractStatus: String
  bussines: string
  file: File
}

export interface PurchaseContractParams
  extends DefaultPaging,
    PurchaseContractType {}
