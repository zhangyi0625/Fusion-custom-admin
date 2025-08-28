import { DefaultPaging } from '@/types/global'

export interface ContractsType {
  id?: string
  name: string
  phone: string
  supplierId: string
}

export interface ContractsParams
  extends Partial<ContractsType>,
    DefaultPaging {}
