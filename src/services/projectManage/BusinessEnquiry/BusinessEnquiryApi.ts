import { HttpRequest } from '@/utils/request'
import type {
  BusinessEnquiryParams,
  BusinessEnquiryType,
  BusinessEnquiryDownloadType,
  BusinessEnquiryImportType,
  BusinessEnquiryProductType,
  BusinessFollowRecordType,
} from './BusinessEnquiryModel'
import { MakeQuotationTableType } from '../SaleProject/SaleProjectModel'

/**
 * 枚举商机询价相关的api
 */
export enum BusinessEnquiryApi {
  businessEnquiryList = '/business/project',
  businessEnquiryListByPage = '/business/project/page',
  businessUpgrade = '/business/project/upgrade/',
  businessOperationRecord = '/business/project-event/',
  businessEnquiryRecord = '/business/project-inquiry-quote/',
  businessEnquiryProduct = '/business/project-inquiry-product',
  businessBatchEnquiryProduct = '/business/project-inquiry-product/allot',
  businessFollowRecord = '/business/project-follow',
  businessSupplier = '/business/project-supplier',
  businessBatchSupplier = '/business/project-supplier/allot',
  businessDownloadEnquiry = '/business/project-supplier/download/quotation',
  businessImportEnquiry = '/business/project-supplier/inquiry',
  confirmBusinessSupplier = '/business/project-supplier/confirmSupplier',
  businessProductList = '/business/project-supplier/product',
  batchBusinessProductList = '/business/project-supplier/product/batch',
  downloadBusinessProject = '/business/project-inquiry-product/download/',
}

/**
 * 获取商机询价列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryList = (
  params: Partial<BusinessEnquiryParams>,
) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 分页获取商机询价列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryListPage = (params: BusinessEnquiryParams) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 添加商机询价
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const addBusinessEnquiryList = (params: BusinessEnquiryType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 修改商机询价
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const updateBusinessEnquiryList = (params: BusinessEnquiryType) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.businessEnquiryList,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 删除商机询价
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const deleteBusinessEnquiryList = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: BusinessEnquiryApi.businessEnquiryList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 查询商机询价详情
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryDetail = (id: string | number) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 升级商机询价
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const upgradeBusinessEnquiry = (id: string | number) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.businessUpgrade + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价全部操作记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessOperationRecord = (id: string | number) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessOperationRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价全部询价记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryRecord = (
  id: string | number,
  params: { isInquiry: boolean | string },
) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryRecord + id,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 获取全部询价产品列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryProduct = (
  id: string | number,
  params?: { keyword: string },
) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessEnquiryProduct + '/' + id,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 获取全部询价产品列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const putBusinessEnquiryProduct = (
  params: BusinessEnquiryProductType,
) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.businessEnquiryProduct,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 删除询价产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const deleteBusinessEnquiryProduct = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: BusinessEnquiryApi.businessEnquiryProduct + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 批量添加询价产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const batchBusinessEnquiryProduct = (params: {
  projectId: string
  products: BusinessEnquiryProductType[]
}) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessBatchEnquiryProduct,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价全部跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessFollowRecord = (id: string | number) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessFollowRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 添加商机询价跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const addBusinessFollowRecord = (params: BusinessFollowRecordType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessFollowRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 修改商机询价跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const updateBusinessFollowRecord = (
  params: BusinessFollowRecordType,
) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.businessFollowRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 删除商机询价跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const deleteBusinessFollowRecord = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: BusinessEnquiryApi.businessFollowRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价全部供应商
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessSupplier = (id: string) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessSupplier + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 删除商机询价供应商
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const deleteBusinessSupplier = (id: string) => {
  return HttpRequest.delete(
    {
      url: BusinessEnquiryApi.businessSupplier + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 批量添加商机询价供应商
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const addBatchBusinessSupplier = (params: {
  projectId: string
  supplierIds: string[]
}) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessBatchSupplier,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价上传询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const downloadBusinessEnquiry = (
  params: BusinessEnquiryDownloadType,
) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessDownloadEnquiry,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 导入商机询价生成询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const importBusinessEnquiry = (params: BusinessEnquiryImportType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.businessImportEnquiry,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 确认商机询价生成询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const confirmBusinessSupplier = (params: {
  projectId: string
  supplierId: string
}) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.confirmBusinessSupplier,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 商机询价全部供应商产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessSupplierProduct = (id: string) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.businessProductList + '/' + id,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 修改商机询价全部供应商产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const putBusinessSupplierProduct = (
  params: MakeQuotationTableType[],
) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.batchBusinessProductList,
      data: params,
    },
    {
      successMessageMode: 'none',
    },
  )
}

/**
 * 下载商机询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const downloadBusinessProject = (id: string) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.downloadBusinessProject + '/' + id,
      responseType: 'blob',
    },
    {
      successMessageMode: 'none',
      isTransformResponse: true,
    },
  )
}
