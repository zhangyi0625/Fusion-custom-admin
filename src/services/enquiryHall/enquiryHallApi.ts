import { HttpRequest } from '@/utils/request'
import type { EnquiryHallItemParams } from './enquiryHallModel'
import { ProductManageType } from '../productManage/productManageModel'

/**
 * 枚举询价相关的api
 */
export enum EnquiryHallApi {
  systemArea = '/business/area',
  enquiryManageByPage = '/supplier/inquiry/page',
  enquiryManage = '/supplier/inquiry',
  addSupplierQuotation = '/supplier/quotation',
}

/**
 * 获取省市区数据
 * @param params 询价参数
 * @returns 询价列表
 */
export const getEnquiryCity = () => {
  return HttpRequest.get(
    {
      url: EnquiryHallApi.systemArea,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取客户询价列表
 * @param params 询价参数
 * @returns 询价列表
 */
export const getEnquiryManageByPage = (params: EnquiryHallItemParams) => {
  return HttpRequest.get(
    {
      url: EnquiryHallApi.enquiryManageByPage,
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
export const getEnquiryManage = (params?: EnquiryHallItemParams) => {
  return HttpRequest.get(
    {
      url: EnquiryHallApi.enquiryManage,
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
export const getEnquiryManageDetail = (id: string) => {
  return HttpRequest.get(
    {
      url: EnquiryHallApi.enquiryManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加询价
 * @param params 询价参数
 * @returns
 */
export const addSupplierQuotation = (params: {
  inquiryId: string
  items: Omit<ProductManageType, 'status' | 'remark' | 'pinyin' | 'sort'>[]
}) => {
  return HttpRequest.post(
    {
      url: EnquiryHallApi.addSupplierQuotation,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
