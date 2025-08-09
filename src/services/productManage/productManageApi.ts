import { HttpRequest } from '@/utils/request'
import type {
  ProductClassParams,
  ProductManageClassType,
  ProductManageParams,
  ProductManageType,
} from './productManageModel'

/**
 * 枚举产品管理相关的api
 */
export enum ProductManageApi {
  ProductManage = '/business/product',
  ProductManageByPage = '/business/product/page',
  ProductManageClass = '/business/product-attr',
  ProductManageClassByPage = '/business/product-attr/page',
}

/**
 * 分页获取产品管理列表
 * @param params 产品管理参数
 * @returns 产品管理列表
 */
export const getProductByPage = (params: ProductManageParams) => {
  return HttpRequest.get(
    {
      url: ProductManageApi.ProductManageByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页获取产品分类管理列表
 * @param params 产品管理参数
 * @returns 产品管理列表
 */
export const getProductClassByPage = (params: ProductClassParams) => {
  return HttpRequest.get(
    {
      url: ProductManageApi.ProductManageClassByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取产品管理列表
 * @param params 产品管理参数
 * @returns 产品管理列表
 */
export const getProductList = (params: ProductManageType) => {
  return HttpRequest.get(
    {
      url: ProductManageApi.ProductManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取产品分类管理列表
 * @param params 产品管理参数
 * @returns 产品管理列表
 */
export const getProductClassList = (
  params: Pick<ProductClassParams, 'parentId' | 'sort'>
) => {
  return HttpRequest.get(
    {
      url: ProductManageApi.ProductManageClass,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加产品管理
 * @param params 产品管理参数
 * @returns
 */
export const addProduct = (params: ProductManageType) => {
  return HttpRequest.post(
    {
      url: ProductManageApi.ProductManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加产品分类管理
 * @param params 产品管理参数
 * @returns
 */
export const addProductClass = (params: ProductManageClassType) => {
  return HttpRequest.post(
    {
      url: ProductManageApi.ProductManageClass,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新产品管理
 * @param params 产品管理参数
 * @returns
 */
export const updateProduct = (params: ProductManageType) => {
  return HttpRequest.put(
    {
      url: ProductManageApi.ProductManage,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新产品分类管理
 * @param params 产品管理参数
 * @returns
 */
export const updateProductClass = (params: ProductManageClassType) => {
  return HttpRequest.put(
    {
      url: ProductManageApi.ProductManageClass,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除产品管理
 * @param id
 * @returns
 */
export const deleteProduct = (id: string) => {
  return HttpRequest.delete(
    {
      url: ProductManageApi.ProductManage + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除产品分类管理
 * @param id
 * @returns
 */
export const deleteProductClass = (id: string) => {
  return HttpRequest.delete(
    {
      url: ProductManageApi.ProductManageClass + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}
