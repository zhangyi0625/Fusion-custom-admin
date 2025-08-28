import { DefaultPaging } from '@/types/global'

export interface PayerUnitType {
  id?: string
  code: string
  name: string
  status: boolean | number
}

export interface PayerUnitParams extends Partial<PayerUnitType>, DefaultPaging {
  sort: string
}
