import { HttpRequest } from '@/utils/request'
import type {
  SaleContractAttachmentType,
  SaleContractNoteType,
  SaleContractParams,
  SaleContractType,
} from './SalesContractModel'

/**
 * 枚举销售合同相关的api
 */
export enum ContractManageApi {
  ContractManage = '/business/contract',
  ContractManageByPage = '/business/contract/page',
  ContractAttachment = '/business/contract-attachment',
  ContractNote = '/business/contract-invoice',
}

/**
 * 分页获取销售合同列表
 * @param params 销售合同参数
 * @returns 销售合同列表
 */
export const getContractManageByPage = (params: SaleContractParams) => {
  return HttpRequest.get(
    {
      url: ContractManageApi.ContractManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取销售合同列表
 * @param params 销售合同参数
 * @returns 销售合同列表
 */
export const getContractManage = (params: Partial<SaleContractParams>) => {
  return HttpRequest.get(
    {
      url: ContractManageApi.ContractManage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加销售合同
 * @param params 销售合同参数
 * @returns
 */
export const addContractManage = (params: SaleContractType) => {
  return HttpRequest.post(
    {
      url: ContractManageApi.ContractManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新销售合同
 * @param params 销售合同参数
 * @returns
 */
export const updateContractManage = (params: SaleContractType) => {
  return HttpRequest.put(
    {
      url: ContractManageApi.ContractManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除销售合同
 * @param id
 * @returns
 */
export const deleteContractManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: ContractManageApi.ContractManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取销售合同详情
 * @param id
 * @returns
 */
export const getContractManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: ContractManageApi.ContractManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取销售合同附件列表
 * @param params 销售合同参数
 * @returns 销售合同列表
 */
export const getContractAttachment = (id: string) => {
  return HttpRequest.get(
    {
      url: ContractManageApi.ContractAttachment + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加销售合同附件
 * @param params 销售合同参数
 * @returns
 */
export const addContractAttachment = (params: SaleContractAttachmentType) => {
  return HttpRequest.post(
    {
      url: ContractManageApi.ContractAttachment,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除销售合同附件
 * @param id
 * @returns
 */
export const deleteContractAttachment = (id: string) => {
  return HttpRequest.delete(
    {
      url: ContractManageApi.ContractAttachment + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取销售合票据列表
 * @param params 销售合同参数
 * @returns 销售合同列表
 */
export const getContractNote = (id: string) => {
  return HttpRequest.get(
    {
      url: ContractManageApi.ContractNote + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加销售合同票据
 * @param params 销售合同参数
 * @returns
 */
export const addContractNote = (params: SaleContractNoteType) => {
  return HttpRequest.post(
    {
      url: ContractManageApi.ContractNote,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改销售合同票据
 * @param params 销售合同参数
 * @returns
 */
export const updateContractNote = (params: SaleContractNoteType) => {
  return HttpRequest.put(
    {
      url: ContractManageApi.ContractNote,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除销售合同票据
 * @param id
 * @returns
 */
export const deleteContractNote = (id: string) => {
  return HttpRequest.delete(
    {
      url: ContractManageApi.ContractNote + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
