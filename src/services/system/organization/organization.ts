import { HttpRequest } from '@/utils/request'
import type { SysOrganizationType } from './organizationModel'

/**
 * 枚举角色相关的api
 */
export enum OrganizationApi {
  organizationList = '/system/organization',
  organizationListByPage = '/system/organization/page',
  batchOrganization = '/system/organization/batch',
}

/**
 * 分页查询租户列表
 * @param params 租户参数
 * @returns 租户列表
 */
export const getOrganizationListByPage = (params: SysOrganizationType) => {
  return HttpRequest.get(
    {
      url: OrganizationApi.organizationListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 全部租户列表
 * @param params 租户参数
 * @returns 租户列表
 */
export const getOrganizationList = () => {
  return HttpRequest.get(
    {
      url: OrganizationApi.organizationList,
    },
    {
      successMessageMode: 'none',
    }
  )
}
/**
 * 新增租户
 * @param params 租户参数
 */
export const addOrganization = (params: SysOrganizationType) => {
  return HttpRequest.post(
    {
      url: OrganizationApi.organizationList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改租户
 * @param params 租户参数
 */
export const updateOrganization = (params?: SysOrganizationType) => {
  return HttpRequest.put(
    {
      url: OrganizationApi.organizationList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除租户
 * @param params 租户参数
 */
export const deleteOrganization = (id: string) => {
  return HttpRequest.delete(
    {
      url: OrganizationApi.organizationList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量删除租户
 * @param params 租户参数
 */
export const deleteBatchOrganization = (id: string[]) => {
  return HttpRequest.delete(
    {
      url: OrganizationApi.batchOrganization,
      data: id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
