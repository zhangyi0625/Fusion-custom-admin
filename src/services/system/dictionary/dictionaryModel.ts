export interface SysDictionaryClassType {
  dictName: string
  dictId?: string | null
  comments?: string
  dictCode: string
  sort: number
}

export interface SysDictionaryType extends SysDictionaryClassType {
  dictDataName: string
  dictDataCode: string
}

export interface SysDictionaryParams extends Pick<SysDictionaryType, 'dictId'> {
  page: number
  limit: number
}
