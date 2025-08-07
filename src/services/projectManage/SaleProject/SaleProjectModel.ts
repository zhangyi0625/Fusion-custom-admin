export interface MakeQuotationTableType {
  id: string
  name: string
  unit: string
  count: number
  price: string
  pricesSum: string
  changePrice: string | number | null
  changePriceSum: string | number | null
}
