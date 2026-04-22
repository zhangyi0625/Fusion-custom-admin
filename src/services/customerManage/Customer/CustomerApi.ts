import { HttpRequest } from '@/utils/request'
import type {
  CustomerParams,
  CustomerType,
  FollowCustomerType,
} from './CustomerModel'

/**
 * 枚举客户管理相关的api
 */
export enum CustomerManageApi {
  CustomerManage = '/business/customer',
  CustomerManageByPage = '/business/customer/my/page',
  CustomerManageByPageCommon = '/business/customer/common/page',
  CustomerManageRecord = '/business/customer-event/',
  CustomerManageReceiveCustomer = '/business/customer/receive',
  CustomerManageReleaseCustomer = '/business/customer/release',
  CustomerManageFollowCustomer = '/business/customer-follow',
}

/**
 * 获取全部客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerList = (params: Partial<CustomerParams>) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
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
    },
  )
}

/**
 * 分页获取公海客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerByPageCommon = (params: CustomerParams) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManageByPageCommon,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
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
    },
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
    },
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
    },
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
    },
  )
}

/**
 * 获取客户详情
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerDetail = (customerId: string) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManage + '/' + customerId,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 获取客户修改记录列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerRecord = (customerId: string) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManageRecord + customerId,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 领取客户管理
 * @param params 客户管理参数
 * @returns
 */
export const receiveCustomer = (ids: string[]) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.CustomerManageReceiveCustomer,
      data: ids,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 释放客户管理
 * @param params 客户管理参数
 * @returns
 */
export const releaseCustomer = (ids: string[]) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.CustomerManageReleaseCustomer,
      data: ids,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 获取客户跟进记录列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getFollowCustomer = (params: { customerId: string }) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.CustomerManageFollowCustomer,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 新增客户跟进记录
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const postFollowCustomer = (params: FollowCustomerType) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.CustomerManageFollowCustomer,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 更新客户跟进记录
 * @param params 客户管理参数
 * @returns
 */
export const updateFollowCustomer = (params: FollowCustomerType) => {
  return HttpRequest.put(
    {
      url: CustomerManageApi.CustomerManageFollowCustomer,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 删除客户跟进记录
 * @param id
 * @returns
 */
export const deleteFollowCustomer = (id: string) => {
  return HttpRequest.delete(
    {
      url: CustomerManageApi.CustomerManageFollowCustomer + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}
