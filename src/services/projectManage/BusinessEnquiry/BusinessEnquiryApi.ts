import { HttpRequest } from '@/utils/request'
import type {
  BusinessEnquiryParams,
  BusinessEnquiryType,
} from './BusinessEnquiryModel'

/**
 * 枚举商家询价相关的api
 */
export enum BusinessEnquiryApi {
  businessEnquiryList = '/business-enquiry',
  businessEnquiryListByPage = '/business-enquiry/page',
  productList = '/business-enquiry/product',
  supplierList = '/business-enquiry/supplier',
}

/**
 * 获取商家询价列表
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const getBusinessEnquiryList = (params: BusinessEnquiryParams) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取商家询价列表
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const getBusinessEnquiryListPage = (params: BusinessEnquiryParams) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加商家询价
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const addBusinessEnquiryList = (params: BusinessEnquiryType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改商机询价
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const updateBusinessEnquiryList = (params: BusinessEnquiryType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除商机询价
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const deleteBusinessEnquiryList = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: BusinessEnquiryApi.businessEnquiryList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取全部产品列表
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const getProductList = () => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.productList,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取全部供应商列表
 * @param params 商家询价参数
 * @returns 商家询价列表
 */
export const getSupplierList = () => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.supplierList,
    },
    {
      successMessageMode: 'none',
    }
  )
}
