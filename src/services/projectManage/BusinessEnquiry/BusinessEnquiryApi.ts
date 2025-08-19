import { HttpRequest } from '@/utils/request'
import type {
  BusinessEnquiryParams,
  BusinessEnquiryType,
  BussinesEnquiryDownloadType,
  BussinesEnquiryImportType,
  BussinesEnquiryProductType,
  BussinesFollowRecordType,
} from './BusinessEnquiryModel'
import { MakeQuotationTableType } from '../SaleProject/SaleProjectModel'

/**
 * 枚举商机询价相关的api
 */
export enum BusinessEnquiryApi {
  businessEnquiryList = '/business/project',
  businessEnquiryListByPage = '//business/project/page',
  businessUpgrade = '/business/project/upgrade/',
  bussinesOperationRecord = '/business/project-event/',
  bussinesEnquiryRecord = '/business/project-inquiry-quote/',
  bussinesEnquiryProduct = '/business/project-inquiry-product',
  bussinesBatchEnquiryProduct = '/business/project-inquiry-product/batch',
  bussinesFollowRecord = '/business/project-follow',
  bussinesSupplier = '/business/project-supplier',
  bussinesBatchSupplier = '/business/project-supplier/allot',
  bussinesDownloadEnquiry = '/business/project-supplier/download/quotation',
  bussinesImportEnquiry = '/business/project-supplier/inquiry',
  confirmBussinesSupplier = '/business/project-supplier/confirmSupplier',
  bussinessProductList = '/business/project-supplier/product',
  batchBussinessProductList = '/business/project-supplier/product/batch',
  downloadbusinessProject = '/business/project-inquiry-product/download/',
}

/**
 * 获取商机询价列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryList = (
  params: Partial<BusinessEnquiryParams>
) => {
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
    }
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
    }
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
    }
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
    }
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
    }
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
      url: BusinessEnquiryApi.businessUpgrade + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesOperationRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 商机询价全部询价记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryRecord = (
  id: string | number,
  params: { isInquery: boolean | string }
) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.bussinesEnquiryRecord + id,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取全部询价产品列表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const getBusinessEnquiryProduct = (
  id: string | number,
  params?: { keyword: string }
) => {
  return HttpRequest.get(
    {
      url: BusinessEnquiryApi.bussinesEnquiryProduct + '/' + id,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesEnquiryProduct + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量添加询价产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const batchBusinessEnquiryProduct = (params: {
  projectId: string
  products: BussinesEnquiryProductType[]
}) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.bussinesBatchEnquiryProduct,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesFollowRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加商机询价跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const addBusinessFollowRecord = (params: BussinesFollowRecordType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.bussinesFollowRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改商机询价跟进记录
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const updateBusinessFollowRecord = (
  params: BussinesFollowRecordType
) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.bussinesFollowRecord,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesFollowRecord + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesSupplier + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesSupplier + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinesBatchSupplier,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 商机询价上传询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const downloadBusinessEnquiry = (
  params: BussinesEnquiryDownloadType
) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.bussinesDownloadEnquiry,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 导入商机询价生成询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const importBusinessEnquiry = (params: BussinesEnquiryImportType) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.bussinesImportEnquiry,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 确认商机询价生成询价表
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const confirmBussinesSupplier = (params: {
  projectId: string
  supplierId: string
}) => {
  return HttpRequest.post(
    {
      url: BusinessEnquiryApi.confirmBussinesSupplier,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.bussinessProductList + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 修改商机询价全部供应商产品
 * @param params 商机询价参数
 * @returns 商机询价列表
 */
export const putBusinessSupplierProduct = (
  params: MakeQuotationTableType[]
) => {
  return HttpRequest.put(
    {
      url: BusinessEnquiryApi.batchBussinessProductList,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
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
      url: BusinessEnquiryApi.downloadbusinessProject + '/' + id,
      responseType: 'blob',
    },
    {
      successMessageMode: 'none',
      isTransformResponse: true,
    }
  )
}
