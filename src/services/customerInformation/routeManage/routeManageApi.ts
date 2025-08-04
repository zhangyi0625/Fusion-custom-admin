import { HttpRequest } from '@/utils/request'
import type { RouteMangeParams, RouteMangeType } from './routeManageModel'

/**
 * 枚举航线管理相关的api
 */
export enum RouteManageApi {
  routeManage = '/core/business/route-fnd',
  routeManageByPage = '/core/business/route-fnd/page',
}

/**
 * 分页获取航线管理列表
 * @param params 航线管理参数
 * @returns 航线管理列表
 */
export const getRouteManageListByPage = (params?: RouteMangeParams) => {
  return HttpRequest.get(
    {
      url: RouteManageApi.routeManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 航线管理列表
 * @param params 航线管理参数
 * @returns 航线管理列表
 */
export const getRouteManageList = (params?: RouteMangeParams) => {
  return HttpRequest.get(
    {
      url: RouteManageApi.routeManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
/**
 * 新增航线管理
 * @param params 航线管理参数
 */
export const addRouteManage = (params: RouteMangeType) => {
  return HttpRequest.post(
    {
      url: RouteManageApi.routeManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改航线管理
 * @param params 航线管理参数
 */
export const updateRouteManage = (params: RouteMangeType) => {
  return HttpRequest.put(
    {
      url: RouteManageApi.routeManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除航线管理
 * @param params 航线管理参数
 */
export const deleteRouteManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: RouteManageApi.routeManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
