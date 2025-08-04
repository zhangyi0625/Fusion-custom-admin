import { HttpRequest } from '@/utils/request'
import {
  CabinHistoryParams,
  CabinResultParams,
  CabinTaskTemplateParams,
  CabinTaskTemplateType,
} from './cabinManageModel'
import { CabinTaskTemplateProps } from '@/views/cabinManage/CabinTaskTemplate'

/**
 * 枚举订舱管理相关的api
 */
export enum CabinManageApi {
  cabinManageList = '/core/business/booking-task',
  cabinManageListByPage = '/core/business/booking-task/page',
  cabinOperationLog = '/core/business/booking-task-event/',
  batchAddCabinManage = '/core/business/booking-task/batch',
  closeBatchCabin = '/core/business/booking-task/close',
  openBatchCabinByFrequency = '/core/business/booking-task/high-freq/run',
  openBatchCabinByImmdiate = '/core/business/booking-task/immediate/run',
  stopBatchCabin = '/core/business/booking-task/suspend/run',
  addCabin = '/system/test/add/customer',
  deleteCabin = '/system/test/customer/',
  cabinHistoryList = '/core/business/stowage-history/page',
  cabinResultList = '/core/business/stowage-history/page',
}

/**
 * 获取订舱管理列表
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getCabinManageList = (params: CabinTaskTemplateParams) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.cabinManageList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取订舱管理列表
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getCabinManageListByPage = (params: CabinTaskTemplateParams) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.cabinManageListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取订舱操作日志
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getCabinOperationLog = (id: string | number) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.cabinOperationLog + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加订舱任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const addCabinManageList = (params: CabinTaskTemplateType) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.cabinManageList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加订舱任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const batchAddCabinManage = (params: CabinTaskTemplateType[]) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.batchAddCabinManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量关闭订舱任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const closeBatchCabinManage = (params: string[]) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.closeBatchCabin,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 订舱任务高频启动
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const openBatchCabinByFrequency = (params: {
  ids: string[]
  sameFrequencyTaskId?: string
}) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.openBatchCabinByFrequency,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 订舱任务即可运行
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const openBatchCabinByImmdiate = (params: {
  ids: string[]
  sameFrequencyTaskId?: string
}) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.openBatchCabinByImmdiate,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 停止运行任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const stopBatchCabin = (params: {
  ids: string[]
  sameFrequencyTaskId?: string
}) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.stopBatchCabin,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改订舱任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const updateCabinManageList = (params: CabinTaskTemplateType) => {
  return HttpRequest.put(
    {
      url: CabinManageApi.cabinManageList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加订舱任务
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const deleteCabinManageList = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: CabinManageApi.cabinManageList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取放舱历史列表
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getCabinHistoryList = (params: CabinHistoryParams) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.cabinHistoryList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取订舱结果列表
 * @param params 订舱管理参数
 * @returns 订舱管理列表
 */
export const getCabinResultList = (params: CabinResultParams) => {
  return HttpRequest.get(
    {
      url: CabinManageApi.cabinResultList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加客户
 * @param params 订舱管理参数
 * @returns
 */
export const addCabinManage = (params: CabinTaskTemplateProps) => {
  return HttpRequest.post(
    {
      url: CabinManageApi.addCabin,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除客户
 * @param params 订舱管理参数
 * @returns
 */
export const deleteCabinManage = (id: string) => {
  return HttpRequest.delete(
    {
      url: CabinManageApi.deleteCabin + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
