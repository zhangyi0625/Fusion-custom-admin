import { HttpRequest } from '@/utils/request'
import type { SysUserParams, SysUserType } from '../role/roleModel'

/**
 * 枚举用户相关的api
 */
export enum UserApi {
  userManage = '/system/user',
  userManageByPage = '/system/user/page',
  batchUserManage = '/system/user/batch',
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
  return HttpRequest.post({
    url: UserApi.userManage,
    data: params,
  })
}

/**
 * 编辑用户信息
 * @param params 用户参数
 * @returns 结果
 */
export const editUserList = (params: SysUserType) => {
  return HttpRequest.put({
    url: UserApi.userManage,
    data: params,
  })
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
