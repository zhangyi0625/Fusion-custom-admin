export interface ProductManageType {
  name: string
  pinyin: string
  volt: string
  model: string
  spec: string
  remark: string
  status: boolean | number
  sort: string
  unit: string
}

export interface ProductManageParams extends Partial<ProductManageType> {
  page: number
  limit: number
}

export interface ProductManageClassType {
  id?: string
  parentId: string | number
  name: string | null
  sort: string | number
  children?: any[]
}
export interface ProductClassParams extends Partial<ProductManageClassType> {
  page: number
  limit: number
}
