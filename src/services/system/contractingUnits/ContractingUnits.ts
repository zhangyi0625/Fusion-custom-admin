import { HttpRequest } from '@/utils/request'

/**
 * 枚举签约单位相关的api
 */
export enum ContractingApi {
  contractingUnits = '/system/entrust-unit',
  contractingUnitsByPage = '/system/entrust-unit/page',
}

/**
 * 分页获取签约单位列表
 * @param params 签约单位参数
 * @returns 签约单位列表
 */
export const getContractingByPage = () => {
  return HttpRequest.get(
    {
      url: ContractingApi.contractingUnitsByPage,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取签约单位列表
 * @param params 签约单位参数
 * @returns 签约单位列表
 */
export const getContractingList = () => {
  return HttpRequest.get(
    {
      url: ContractingApi.contractingUnits,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加签约单位
 * @param params 签约单位参数
 * @returns
 */
export const addContracting = (params: { name: string }) => {
  return HttpRequest.post(
    {
      url: ContractingApi.contractingUnits,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新签约单位
 * @param params 签约单位参数
 * @returns
 */
export const updateContracting = (params: { name: string }) => {
  return HttpRequest.put(
    {
      url: ContractingApi.contractingUnits,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除签约单位
 * @param id
 * @returns
 */
export const deleteContracting = (id: string) => {
  return HttpRequest.delete(
    {
      url: ContractingApi.contractingUnits + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
