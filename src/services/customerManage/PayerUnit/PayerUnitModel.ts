export interface PayerUnitType {
  id?: string
  code: string
  name: string
  status: boolean | number
}

export interface PayerUnitParams extends Partial<PayerUnitType> {
  page: number
  limit: number
}
