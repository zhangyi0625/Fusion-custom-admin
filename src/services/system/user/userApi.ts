import { HttpRequest } from '@/utils/request'
import type { SysUserParams, SysUserType } from '../role/roleModel'
import { UserAuthorityType } from './userModel'

/**
 * 枚举用户相关的api
 */
export enum UserApi {
  userManage = '/system/user',
  userManageByPage = '/system/user/page',
  batchUserManage = '/system/user/batch',
  resetUserPassword = '/system/user/password',
  userAuthority = '/system/user-power',
}

/**
 * 查询所有用户列表
 * @returns 用户列表
 */
export const getUserList = () => {
  return HttpRequest.get(
    {
      url: UserApi.userManage,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页查询用户列表
 * @param params 用户参数
 * @returns 用户列表
 */
export const getUserListByPage = (params: SysUserParams) => {
  return HttpRequest.get(
    {
      url: UserApi.userManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增用户
 * @param params 用户参数
 * @returns 结果
 */
export const addUserList = (params: SysUserType) => {
  return HttpRequest.post(
    {
      url: UserApi.userManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 编辑用户信息
 * @param params 用户参数
 * @returns 结果
 */
export const editUserList = (params: SysUserType) => {
  return HttpRequest.put(
    {
      url: UserApi.userManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 重置用户密码
 * @param params 用户参数
 * @returns 结果
 */
export const updateUserPassword = (params: Pick<SysUserType, 'userId'>) => {
  return HttpRequest.put(
    {
      url: UserApi.userManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除用户信息
 * @returns 用户列表
 */
export const deleteUserList = (id: string) => {
  return HttpRequest.delete(
    {
      url: UserApi.userManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量删除用户信息
 * @returns 用户列表
 */
export const deletebatchUserList = (ids: string[]) => {
  return HttpRequest.delete(
    {
      url: UserApi.batchUserManage,
      params: ids,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 查询用户权限
 * @param params 用户参数
 * @returns 用户列表
 */
export const getUserAuthority = (id: string) => {
  return HttpRequest.get(
    {
      url: UserApi.userAuthority + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改用户权限
 * @param params 用户参数
 * @returns 用户列表
 */
export const updateUserAuthority = (params: UserAuthorityType) => {
  return HttpRequest.post(
    {
      url: UserApi.userAuthority,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
