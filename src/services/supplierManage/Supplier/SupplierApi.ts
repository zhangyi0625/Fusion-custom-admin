import { HttpRequest } from '@/utils/request'
import type { SupplierType, SupplierParams } from './SupplierModel'
import { ContractsParams } from '../Contracts/ContractsModel'

/**
 * 枚举供应商管理相关的api
 */
export enum SupplierManageApi {
  SupplierManage = '/business/supplier',
  SupplierManageByPage = '/business/supplier/page',
  SupplierManageRecord = 'business/supplier-event/',
  SupplierContracts = '/business/supplier-contact/page',
}

/**
 * 分页获取供应商管理列表
 * @param params 供应商管理参数
 * @returns 供应商管理列表
 */
export const getSupplierByPage = (params: SupplierParams) => {
  return HttpRequest.get(
    {
      url: SupplierManageApi.SupplierManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取供应商管理列表
 * @param params 供应商管理参数
 * @returns 供应商管理列表
 */
export const getSupplier = (params: Partial<SupplierParams>) => {
  return HttpRequest.get(
    {
      url: SupplierManageApi.SupplierManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加供应商管理
 * @param params 供应商管理参数
 * @returns
 */
export const addSupplier = (params: SupplierType) => {
  return HttpRequest.post(
    {
      url: SupplierManageApi.SupplierManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新供应商管理
 * @param params 供应商管理参数
 * @returns
 */
export const updateSupplier = (params: SupplierType) => {
  return HttpRequest.put(
    {
      url: SupplierManageApi.SupplierManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除供应商管理
 * @param id
 * @returns
 */
export const deleteSupplier = (id: string) => {
  return HttpRequest.delete(
    {
      url: SupplierManageApi.SupplierManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取供应商详情
 * @param params 供应商管理参数
 * @returns 供应商管理列表
 */
export const getSupplierDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: SupplierManageApi.SupplierManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取供应商修改记录
 * @param params 供应商管理参数
 * @returns 供应商管理列表
 */
export const getSupplierRecord = (id: string) => {
  return HttpRequest.get(
    {
      url: SupplierManageApi.SupplierManageRecord + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取供应商联系人
 * @param params 供应商管理参数
 * @returns 供应商管理列表
 */
export const getSupplierContracts = (params: ContractsParams) => {
  return HttpRequest.get(
    {
      url: SupplierManageApi.SupplierContracts,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
