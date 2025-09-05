import { DefaultPaging } from '@/types/global'

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
  amount?: string
  qty?: number
}

export interface ProductManageParams
  extends Partial<ProductManageType>,
    DefaultPaging {
  sort: string
}

export interface ProductManageClassType {
  id?: string
  parentId: string | number
  name: string | null
  sort: string | number
  children?: any[]
}
export interface ProductClassParams
  extends Partial<ProductManageClassType>,
    DefaultPaging {}
