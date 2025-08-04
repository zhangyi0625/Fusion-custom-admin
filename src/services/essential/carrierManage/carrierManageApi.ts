import { HttpRequest } from '@/utils/request'
import type {
  CarrierManageParams,
  CarrierManageType,
} from './carrierManageModel'

/**
 * 枚举船司管理相关的api
 */
export enum CarrierManageApi {
  carrier = '/core/business/base/carrier',
  carrierByPage = '/core/business/base/carrier/page',
}

/**
 * 分页获取船司管理列表
 * @param params 船司管理参数
 * @returns 船司管理列表
 */
export const getCarrierManageListByPage = (params?: CarrierManageParams) => {
  return HttpRequest.get(
    {
      url: CarrierManageApi.carrierByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取船司管理列表
 * @param params 船司管理参数
 * @returns 船司管理列表
 */
export const getCarrierManageList = (params: Partial<CarrierManageParams>) => {
  return HttpRequest.get(
    {
      url: CarrierManageApi.carrier,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加客户
 * @param params 船司管理参数
 * @returns
 */
export const addCarrierManage = (params: CarrierManageType) => {
  return HttpRequest.post(
    {
      url: CarrierManageApi.carrier,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改客户
 * @param params 船司管理参数
 * @returns
 */
export const putCarrierManage = (params: CarrierManageType) => {
  return HttpRequest.put(
    {
      url: CarrierManageApi.carrier,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除客户
 * @param params 船司管理参数
 * @returns
 */
export const deleteCarrierManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: CarrierManageApi.carrier + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
