export interface ShippingAccounType {
  id?: string | null
  type: string | 'QUERY' | 'ORDER'
  carrier: string | null
  customerId: string
  account: string | null
  accountHead: string
  loginPassword: string
  payPassword: string
}

export interface ShippingAccounParams
  extends Pick<ShippingAccounType, 'carrier' | 'account'> {
  page: number
  limit: number
}
