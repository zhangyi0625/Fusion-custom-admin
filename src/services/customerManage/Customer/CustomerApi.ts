import { HttpRequest } from '@/utils/request'
import type { CustomerParams, CustomerType } from './CustomerModel'

/**
 * 枚举客户管理相关的api
 */
export enum CustomerManageApi {
  CustomerManage = '/business/customer',
  CustomerManageByPage = '/business/customer/page',
}

/**
 * 分页获取客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerByPage = (params: CustomerParams) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取产品分类管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerClassByPage = (params: CustomerParams) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加客户管理
 * @param params 客户管理参数
 * @returns
 */
export const addCustomer = (params: CustomerType) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.CustomerManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新客户管理
 * @param params 客户管理参数
 * @returns
 */
export const updateCustomer = (params: CustomerType) => {
  return HttpRequest.put(
    {
      url: CustomerManageApi.CustomerManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除客户管理
 * @param id
 * @returns
 */
export const deleteCustomer = (id: string) => {
  return HttpRequest.delete(
    {
      url: CustomerManageApi.CustomerManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
