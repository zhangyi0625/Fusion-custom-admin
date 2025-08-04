import { HttpRequest } from '@/utils/request'
import { PortManageParams, PortManageType } from './portManageApi'

/**
 * 枚举港口相关的api
 */
export enum PortManageApi {
  portManageList = '/core/business/port',
  PortManageListByPage = '/core/business/port/page',
  portFndList = '/core/business/port/fnd',
  portPorList = '/core/business/port/por',
  portAllRoute = '/core/business/route',
  portAllCountry = '/core/business/country',
}

/**
 * 分页获取所有港口列表
 * @param params 港口管理参数
 * @returns 港口列表
 */
export const getAllPortManageListByPage = (params: PortManageParams) => {
  return HttpRequest.get(
    {
      url: PortManageApi.PortManageListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取所有港口列表
 * @param params 港口管理参数
 * @returns 港口列表
 */
export const getAllPortManageList = (params: PortManageParams) => {
  return HttpRequest.get(
    {
      url: PortManageApi.portManageList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增、修改港口信息
 * @param params 港口管理参数
 * @returns
 */
export const addPortManage = (params: PortManageType) => {
  return HttpRequest.post(
    {
      url: PortManageApi.portManageList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 新增、修改港口信息
 * @param params 港口管理参数
 * @returns
 */
export const updatePortManage = (params: PortManageType) => {
  return HttpRequest.put(
    {
      url: PortManageApi.portManageList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更改港口状态
 * @param params 港口管理参数
 * @returns
 */
export const updatePortManageStatus = (params: PortManageType) => {
  return HttpRequest.put(
    {
      url: PortManageApi.portManageList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取港口航线列表
 * @param params 港口管理参数
 * @returns 港口航线列表
 */
export const getPortRouteManageList = () => {
  return HttpRequest.get(
    {
      url: PortManageApi.portAllRoute,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取港口国家列表
 * @param params 港口管理参数
 * @returns 港口国家列表
 */
export const getPortCountryManageList = () => {
  return HttpRequest.get(
    {
      url: PortManageApi.portAllCountry,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取起运港列表
 * @param params 港口管理参数
 * @returns 起运港列表
 */
export const getPorPortManageList = () => {
  return HttpRequest.get(
    {
      url: PortManageApi.portPorList,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取目的港列表
 * @param params 港口管理参数
 * @returns 目的港列表
 */
export const getFndPortManageList = () => {
  return HttpRequest.get(
    {
      url: PortManageApi.portFndList,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除港口
 * @param id
 * @returns
 */
export const deletePortManage = (id: String) => {
  return HttpRequest.delete(
    {
      url: PortManageApi.portManageList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
