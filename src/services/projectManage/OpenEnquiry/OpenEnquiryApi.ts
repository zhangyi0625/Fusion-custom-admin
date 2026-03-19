import { HttpRequest } from '@/utils/request'
import { OpenEnquiryParams } from './OpenEnquiryModel'
import { ProductManageType } from '@/services/productManage/productManageModel'

/**
 * 枚举开放询价相关的api
 */
export enum OpenEnquiryApi {
  openEnquiryList = '/business/customer-inquiry',
  openListByPage = '/business/customer-inquiry/page',
  allocationEnquiry = '/business/customer-inquiry/allot/product/',
  auditEnquiry = '/business/customer-inquiry/review',
}

/**
 * 获取开放询价列表
 * @param params 开放询价参数
 * @returns 开放询价列表
 */
export const getOpenEnquiryList = (params: Partial<OpenEnquiryParams>) => {
  return HttpRequest.get(
    {
      url: OpenEnquiryApi.openEnquiryList,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 分页获取开放询价列表
 * @param params 开放询价参数
 * @returns 开放询价列表
 */
export const getOpenEnquiryListPage = (params: OpenEnquiryParams) => {
  return HttpRequest.get(
    {
      url: OpenEnquiryApi.openListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 获取开放询价详情
 * @param params 开放询价参数
 * @returns 开放询价列表
 */
export const getOpenEnquiryListDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: OpenEnquiryApi.openEnquiryList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 分配放询价
 * @param params 开放询价参数
 * @returns 开放询价列表
 */
export const postAllocationEnquiry = (
  id: string,
  params: ProductManageType[],
) => {
  return HttpRequest.post(
    {
      url: OpenEnquiryApi.allocationEnquiry + id,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 审核询价
 * @param params 开放询价参数
 * @returns 开放询价列表
 */
export const postAuditEnquiry = (params: {
  cause: string | null
  id: string
  status: string
}) => {
  return HttpRequest.post(
    {
      url: OpenEnquiryApi.auditEnquiry,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}
