import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'
import { ServiceSettingType } from '@/services/setting/serviceSettingModel'

/**
 * 枚举系统配置需要的接口地址
 */
export enum PublicApi {
  publicData = '/common/public-data',
  publicSetting = '/common/public-settings',
  serviceSetting = '/core/business/mq-service-config',
  loginLogByPage = '/system/login-record/page',
}

/**
 * 查询系统参数
 */
export const getPublicData = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.publicData,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询系统配置
 */
export const getPublicSetting = () => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.publicSetting,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询服务配置
 */
export const getServiceSetting = () => {
  return HttpRequest.get(
    {
      url: PublicApi.serviceSetting,
    },
    { isTransformResponse: false }
  )
}

/**
 * 添加服务配置
 */
export const addServiceSetting = (params: ServiceSettingType) => {
  return HttpRequest.post(
    {
      url: PublicApi.serviceSetting,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 修改服务配置
 */
export const updateServiceSetting = (params: ServiceSettingType) => {
  return HttpRequest.put(
    {
      url: PublicApi.serviceSetting,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 删除服务设置
 */
export const deleteServiceSetting = (id: string | number) => {
  return HttpRequest.delete(
    {
      url: PublicApi.serviceSetting + '/' + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询系统登录日志
 */
export const getLoginLog = (params: { page: number; limit: number }) => {
  return HttpRequest.get<Response>(
    {
      url: PublicApi.loginLogByPage,
      params: params,
    },
    { isTransformResponse: false }
  )
}
