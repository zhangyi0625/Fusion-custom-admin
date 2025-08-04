import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'

/**
 * 枚举系统配置需要的接口地址
 */
export enum UploadApi {
  uploadFile = '/api/file/upload',
}

/**
 * 查询系统参数
 */
export const postUploadFile = (params: FormData) => {
  return HttpRequest.post<Response>(
    {
      url: UploadApi.uploadFile,
      params,
    },
    { isTransformResponse: false }
  )
}
