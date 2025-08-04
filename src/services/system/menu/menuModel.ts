/**
 * 菜单
 */
export interface MenuModel {
  // id: string
  menuId: string | null
  parentId: string | null
  title: string
  url: string
  component: string
  componentName: string
  redirect?: string
  menuType: number
  perms?: string
  permsType?: string
  sortNo: number
  alwaysShow: boolean
  icon: string
  route?: boolean
  leaf: boolean
  keepAlive?: boolean
  hidden: boolean
  hideTab?: boolean
  description?: string
  delFlag: number
  ruleFlag?: number
  status: string
  internalOrExternal?: boolean
  children?: MenuModel[]
}

export interface MenuParams
  extends Partial<
    Pick<MenuModel, 'title' | 'menuType' | 'status' | 'parentId'>
  > {
  page?: number
  limit?: number
  sort?: string
}

/**
 * 目录
 */
export interface Directory {
  title: string
  value: string
  children?: Directory[]
}

export type directoryResult = {
  code: number
  directory: Directory[]
}
