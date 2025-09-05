import { HttpRequest } from '@/utils/request'
import type { MyEnquiryParams } from './myEnquiryModel'

/**
 * 枚举我的询价相关的api
 */
export enum MyEnquiryApi {
  myEnquiryByPage = '/supplier/client/supplier-quotation/page',
  myEnquiry = '/supplier/client/supplier-quotation',
}

/**
 * 分页获取我的询价列表
 * @param params 询价参数
 * @returns 询价列表
 */
export const getMyEnquiryByPage = (params: MyEnquiryParams) => {
  return HttpRequest.get(
    {
      url: MyEnquiryApi.myEnquiryByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取客户询价列表
 * @param params 询价参数
 * @returns 询价列表
 */
export const getMyEnquiryManage = (params?: MyEnquiryParams) => {
  return HttpRequest.get(
    {
      url: MyEnquiryApi.myEnquiry,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取客户询价详情
 * @param params 询价参数
 * @returns 询价列表
 */
export const getMyEnquiryManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: MyEnquiryApi.myEnquiry + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
