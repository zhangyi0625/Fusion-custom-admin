import { HttpRequest } from '@/utils/request'
import { CustomerManageParams, CustomerManageType } from './customerManageModel'

/**
 * 枚举客户管理相关的api
 */
export enum CustomerManageApi {
  customer = '/core/business/customer',
  customerByPage = '/core/business/customer/page',
}

/**
 * 分页获取客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerManageListByPage = (params: CustomerManageParams) => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.customerByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取客户管理列表
 * @param params 客户管理参数
 * @returns 客户管理列表
 */
export const getCustomerManageList = () => {
  return HttpRequest.get(
    {
      url: CustomerManageApi.customer,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加客户
 * @param params 客户管理参数
 * @returns
 */
export const addCustomerManage = (params: CustomerManageType) => {
  return HttpRequest.post(
    {
      url: CustomerManageApi.customer,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改客户
 * @param params 客户管理参数
 * @returns
 */
export const putCustomerManage = (params: CustomerManageType) => {
  return HttpRequest.put(
    {
      url: CustomerManageApi.customer,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除客户
 * @param params 客户管理参数
 * @returns
 */
export const deleteCustomerManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: CustomerManageApi.customer + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
