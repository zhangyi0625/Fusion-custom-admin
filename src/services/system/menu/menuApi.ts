import { HttpRequest } from '@/utils/request'
import { MenuParams } from './menuModel'

/**
 * 枚举菜单相关的请求API
 */
export enum Api {
  // 根据token获取菜单（多用于框架上根据角色获取菜单那种）
  // getMenuList = '/system/getMenusByRole',
  getMenuList = '/system/menu',
  getMemuListByPage = '/system/menu/page',
  // 获取所有菜单
  // getAllMenus = '/system/menu',
  // 获取所有上级菜单
  getDirectory = '/system/menu/getDirectory',
  // 批量删除菜单
  deleteMenuBatch = '/system/menu/batch',
  // 导出（Excel）
  exportMenus = '/system/menu/export',
  // 批量导入
  importMenus = '/system/menu/import',
  // 验证菜单权限
  checkPermission = '/system/menu/checkPermission',
  // 用户下面菜单列表
  userMenuList = '/user/auth/menu',
}

/**
 * 根据角色获取菜单
 * @param params
 * @returns
 */
export const getMenuListByRoleId = (roleId: string) => {
  return HttpRequest.get(
    {
      url: Api.getMenuList + roleId,
    },
    { successMessageMode: 'none' }
  )
}

/**
 * 查询所有菜单
 * @param params 查询条件
 */
export const getMenusList = (params?: MenuParams) => {
  return HttpRequest.get(
    {
      url: Api.getMenuList,
      params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页查询菜单
 * @param params 查询条件
 */
export const getMenusByPage = (params: MenuParams) => {
  return HttpRequest.get(
    {
      url: Api.getMemuListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取所有的一级菜单
 * @returns
 */
export const getDirectory = () => {
  return HttpRequest.get(
    { url: Api.getDirectory },
    { successMessageMode: 'none' }
  )
}

/**
 * 新增菜单
 * @param params 菜单数据
 * @returns
 */
export const addMenu = (params: Record<string, any>) => {
  return HttpRequest.post({
    url: Api.getMenuList,
    data: params,
  })
}

/**
 * 修改菜单数据
 * @param params 菜单数据
 * @returns
 */
export const updateMenu = (params: Record<string, any>) => {
  return HttpRequest.put({
    url: Api.getMenuList,
    data: params,
  })
}

/**
 * 删除菜单
 * @param menuId 菜单ID
 * @returns
 */
export const deleteMenu = (menuId: string) => {
  return HttpRequest.delete({
    url: Api.getMenuList + '/' + menuId,
  })
}

/**
 * 批量删除菜单
 * @param menuIds  选中的菜单
 * @returns
 */
export const deleteMenuBatch = (menuIds: string[]) => {
  return HttpRequest.delete({
    url: Api.deleteMenuBatch,
    data: menuIds,
  })
}

/**
 * 导出菜单（导出到Excel）
 * @param menus 需要导出的菜单数据
 * @returns
 */
export const exportMenu = (menus: any) => {
  return HttpRequest.post({
    url: Api.exportMenus,
    data: menus,
  })
}

/**
 * 导入菜单（从Excel里面导入）
 * @param file 文件内容（Excel文件）
 * @returns
 */
export const importMenu = (file: any) => {
  return HttpRequest.post({
    url: Api.importMenus,
    data: file,
  })
}

/**
 * 验证菜单权限
 * @param params 菜单数据
 * @returns 结果
 */
export const checkPermission = (params: any) => {
  return HttpRequest.post({
    url: Api.checkPermission,
    data: params,
  })
}

/**
 * 根据用户获取菜单
 * @param params
 * @returns
 */
export const getMenuListByUser = () => {
  return HttpRequest.get(
    {
      url: Api.userMenuList,
    },
    { successMessageMode: 'none' }
  )
}
