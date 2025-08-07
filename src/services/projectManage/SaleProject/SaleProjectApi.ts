import { HttpRequest } from '@/utils/request'
import type {
  BusinessEnquiryParams,
  BusinessEnquiryType,
} from '../BusinessEnquiry/BusinessEnquiryModel'

/**
 * 枚举销售项目相关的api
 */
export enum SaleProjectApi {
  saleProjectApiList = '/business-enquiry',
  saleProjectApiListByPage = '/business-enquiry/page',
  saleMakeQuotation = '/business-enquiry/make-quotation',
}

/**
 * 获取销售项目列表
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const getSaleProjectList = (params: BusinessEnquiryParams) => {
  return HttpRequest.get(
    {
      url: SaleProjectApi.saleProjectApiList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取销售项目列表
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const getSaleProjectListPage = (params: BusinessEnquiryParams) => {
  return HttpRequest.get(
    {
      url: SaleProjectApi.saleProjectApiListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加销售项目
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const addSaleProjectList = (params: BusinessEnquiryType) => {
  return HttpRequest.post(
    {
      url: SaleProjectApi.saleProjectApiList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改销售项目
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const updateSaleProjectList = (params: BusinessEnquiryType) => {
  return HttpRequest.post(
    {
      url: SaleProjectApi.saleProjectApiList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除销售项目
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const deleteSaleProjectList = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: SaleProjectApi.saleProjectApiList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取所有制作报价产品
 * @param params 销售项目参数
 * @returns 销售项目列表
 */
export const getSaleProjectQuotation = () => {
  return HttpRequest.get(
    {
      url: SaleProjectApi.saleMakeQuotation,
    },
    {
      successMessageMode: 'none',
    }
  )
}
