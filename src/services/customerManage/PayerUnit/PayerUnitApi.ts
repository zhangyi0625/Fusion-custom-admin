import { HttpRequest } from '@/utils/request'
import type { PayerUnitParams, PayerUnitType } from './PayerUnitModel'

/**
 * 枚举付款单位相关的api
 */
export enum PayerUnitApi {
  PayerUnit = '/business/customer-company',
  PayerUnitByPage = '/business/customer-company/page',
}

/**
 * 分页获取付款单位列表
 * @param params 付款单位参数
 * @returns 付款单位列表
 */
export const getPayerUnitByPage = (params: PayerUnitParams) => {
  return HttpRequest.get(
    {
      url: PayerUnitApi.PayerUnitByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取付款单位列表
 * @param params 付款单位参数
 * @returns 付款单位列表
 */
export const getPayerUnit = (params?: PayerUnitParams) => {
  return HttpRequest.get(
    {
      url: PayerUnitApi.PayerUnit,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加付款单位
 * @param params 付款单位参数
 * @returns
 */
export const addPayerUnit = (params: PayerUnitType) => {
  return HttpRequest.post(
    {
      url: PayerUnitApi.PayerUnit,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新付款单位
 * @param params 付款单位参数
 * @returns
 */
export const updatePayerUnit = (params: PayerUnitType) => {
  return HttpRequest.put(
    {
      url: PayerUnitApi.PayerUnit,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除付款单位
 * @param id
 * @returns
 */
export const deletePayerUnit = (id: string) => {
  return HttpRequest.delete(
    {
      url: PayerUnitApi.PayerUnit + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
