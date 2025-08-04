import { HttpRequest } from '@/utils/request'
import type {
  SysRoleParams,
  SysRoleType,
  SysUserParams,
  SysUserType,
} from './roleModel'

/**
 * 枚举角色相关的api
 */
export enum RoleApi {
  /**
   * 获取角色列表
   */
  getRoleList = '/system/role',
  /**
   * 分页获取角色列表
   */
  getRoleListByPage = '/system/role/page',
  /**
   * 获取角色详情
   */
  getRoleDetail = '/system/role/detail',

  /**
   * 改变角色状态
   */
  changeStatus = '/system/role/changeStatus',

  /**
   * 批量删除角色
   */
  batchDeleteRole = '/system/role/batch',

  /**
   * 获取角色菜单
   */
  getRoleMenu = '/system/role-menu/',

  /**
   * 获取角色用户
   */
  RoleUser = '/system/user',

  /**
   * 分页获取角色用户
   */
  getRoleUserByPage = '/system/user/page',

  /**
   * 修改角色用户状态
   */
  updateRoleUserStatus = '/system/user/status',

  /**
   * 批量删除角色用户
   */
  batchDeleteRoleUser = '/system/user/batch',

  /**
   * 给角色分配菜单
   */
  assignRoleMenu = '/system/role/assignRoleMenu',

  /**
   * 给角色分配用户
   */
  assignRoleUser = '/system/role/assignRoleUser',

  /**
   * 校验角色编码是否重复
   */
  checkRoleCodeExist = '/system/role/checkRoleCodeExist',
}

/**
 * 查询所有角色列表
 * @returns 角色列表
 */
export const getRoleList = () => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleList,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页查询角色列表
 * @param params 角色参数
 * @returns 角色列表
 */
export const getRoleListByPage = (params: SysRoleParams) => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增角色
 * @param params 角色参数
 * @returns 结果
 */
export const addRole = (params: SysRoleType) => {
  return HttpRequest.post({
    url: RoleApi.getRoleList,
    data: params,
  })
}

/**
 * 编辑角色信息
 * @param params 角色参数
 * @returns 结果
 */
export const editRole = (params: SysRoleType) => {
  return HttpRequest.put({
    url: RoleApi.getRoleList,
    data: params,
  })
}

/**
 * 更新角色状态
 * @param params 角色参数
 * @returns 结果
 */
export const changStatus = (params: SysUserType) => {
  return HttpRequest.put({
    url: RoleApi.updateRoleUserStatus,
    data: params,
  })
}

/**
 * 删除角色
 * @param params 角色参数
 * @returns 结果
 */
export const deleteRole = (id: string) => {
  return HttpRequest.delete({
    url: RoleApi.getRoleList + '/' + id,
  })
}

/**
 * 批量删除角色
 * @param params 角色参数
 * @returns 结果
 */
export const deleteBatchRole = (params: { ids: string[] }) => {
  return HttpRequest.delete({
    url: RoleApi.batchDeleteRole,
    data: params.ids,
  })
}

/**
 * 获取角色菜单权限
 * @param params 角色参数
 * @returns 结果
 */
export const getRoleMenu = (roleId: string) => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleMenu + roleId,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分配角色菜单权限
 * @param params 角色参数
 * @returns 结果
 */
export const assignRoleMenu = (params: {
  roleId: string
  menuIds: string[]
}) => {
  return HttpRequest.put({
    url: RoleApi.getRoleMenu + params.roleId,
    data: params.menuIds,
  })
}

/**
 * 分配角色用户
 * @param params 角色参数
 * @returns 结果
 */
export const assignRoleUser = (params: any) => {
  return HttpRequest.post({
    url: RoleApi.assignRoleUser,
    data: params,
  })
}

/**
 * 获取角色用户
 * @param params 角色参数
 * @returns 结果
 */
export const getRoleUser = (params: SysUserParams) => {
  return HttpRequest.get(
    {
      url: RoleApi.RoleUser,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取角色用户
 * @param params 角色参数
 * @returns 结果
 */
export const getRoleUserByPage = (params: SysUserParams) => {
  return HttpRequest.get(
    {
      url: RoleApi.getRoleUserByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const postRoleUser = (params: SysUserType) => {
  return HttpRequest.post(
    {
      url: RoleApi.RoleUser,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const putRoleUser = (params: SysUserType) => {
  return HttpRequest.put(
    {
      url: RoleApi.RoleUser,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const deleteRoleUser = (id: string) => {
  return HttpRequest.delete({
    url: RoleApi.RoleUser + '/' + id,
  })
}

/**
 * 批量删除角色用户
 * @param params 用户参数
 * @returns 结果
 */
export const postBatchRoleUser = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: RoleApi.batchDeleteRoleUser,
      data: ids,
    },
    {
      successMessageMode: 'none',
    }
  )
}
/**
 * 验证角色编码是否存在
 * @param params 角色编码
 * @returns 结果
 */
export const checkRoleCodeExist = (params: any) => {
  return HttpRequest.get(
    {
      url: RoleApi.checkRoleCodeExist,
      params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
