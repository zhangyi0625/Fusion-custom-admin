import { HttpRequest } from '@/utils/request'
import {
  ShippingAccounParams,
  ShippingAccounType,
} from './shippingAccountModel'

/**
 * 枚举船司账号相关的api
 */
export enum ShippingAccountApi {
  shippingAccountByPage = '/core/business/carrier-account/page',
  shippingAccount = '/core/business/carrier-account',
  batchImportShiipingAccount = '/core/business/carrier-account/batch',
  setShippingAccountSearch = '/core/business/carrier-account/query',
  cancelShippingAccountSearch = '/core/business/carrier-account/cancel/query',
  closeShippingAccount = '/core/business/carrier-account/disabled',
  openShippingAccount = '/core/business/carrier-account/enable',
  relevanceShippingAccount = '/core/business/carrier-account/assoc/server',
}

/**
 * 分页获取船司账号列表
 * @param params 船司账号参数
 * @returns 船司账号列表
 */
export const getShippingAccountListByPage = (params: ShippingAccounParams) => {
  return HttpRequest.get(
    {
      url: ShippingAccountApi.shippingAccountByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取船司账号列表
 * @param params 船司账号参数
 * @returns 船司账号列表
 */
export const getShippingAccountList = (params: ShippingAccounParams) => {
  return HttpRequest.get(
    {
      url: ShippingAccountApi.shippingAccount,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加船司账号
 * @param params 船司账号参数
 * @returns
 */
export const addShippingAccountList = (params: ShippingAccounType) => {
  return HttpRequest.post(
    {
      url: ShippingAccountApi.shippingAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量导入船司账号
 * @param params 船司账号参数
 * @returns
 */
export const batchImportShippingAccount = (params: ShippingAccounType[]) => {
  return HttpRequest.post(
    {
      url: ShippingAccountApi.batchImportShiipingAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改船司账号
 * @param params 船司账号参数
 * @returns
 */
export const putShippingAccountList = (params: ShippingAccounType) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.shippingAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除船司账号
 * @param params 船司账号参数
 * @returns
 */
export const deleteShippingAccountList = (id: string) => {
  return HttpRequest.delete(
    {
      url: ShippingAccountApi.shippingAccount + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 设置查询船司账号
 * @param params 船司账号参数
 * @returns
 */
export const putShippingAccountSearch = (id: string[]) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.setShippingAccountSearch,
      data: id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 取消设置船司账号
 * @param params 船司账号参数
 * @returns
 */
export const putShippingAccountCancelSearch = (id: string[]) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.cancelShippingAccountSearch,
      data: id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 启用船司账号
 * @param params 船司账号参数
 * @returns
 */
export const putShippingAccountOpen = (id: string[]) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.openShippingAccount,
      data: id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 关闭船司账号
 * @param params 船司账号参数
 * @returns
 */
export const putShippingAccountClose = (id: string[]) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.closeShippingAccount,
      data: id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 关联服务
 * @param params 船司账号参数
 * @returns
 */
export const relevanceShippingAccountClose = (params: {
  ids: string[]
  serverNo: string
}) => {
  return HttpRequest.put(
    {
      url: ShippingAccountApi.relevanceShippingAccount,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
