import { HttpRequest } from '@/utils/request'
import type {
  ContractsParams,
  ContractsType,
} from '../Contracts/ContractsModel'

/**
 * 枚举联系人相关的api
 */
export enum ContractsApi {
  ContractsManage = '/business/supplier-contact',
  ContractsManageByPage = '/business/supplier-contact/page',
}

/**
 * 分页获取联系人列表
 * @param params 联系人参数
 * @returns 联系人列表
 */
export const getContractsByPage = (params: ContractsParams) => {
  return HttpRequest.get(
    {
      url: ContractsApi.ContractsManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取联系人列表
 * @param params 联系人参数
 * @returns 联系人列表
 */
export const getContracts = (params: Partial<ContractsParams>) => {
  return HttpRequest.get(
    {
      url: ContractsApi.ContractsManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加联系人
 * @param params 联系人参数
 * @returns
 */
export const addContracts = (params: ContractsType) => {
  return HttpRequest.post(
    {
      url: ContractsApi.ContractsManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新联系人
 * @param params 联系人参数
 * @returns
 */
export const updateContracts = (params: ContractsType) => {
  return HttpRequest.put(
    {
      url: ContractsApi.ContractsManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除联系人
 * @param id
 * @returns
 */
export const deleteContracts = (id: string) => {
  return HttpRequest.delete(
    {
      url: ContractsApi.ContractsManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
