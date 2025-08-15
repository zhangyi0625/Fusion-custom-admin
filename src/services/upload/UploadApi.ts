import { HttpRequest } from '@/utils/request'

/**
 * 枚举文件配置需要的接口地址
 */
export enum UploadApi {
  uploadFile = '/system/file/upload',
  downloadFile = '/system/file/download/',
  previewFile = '/system/file/preview/',
}

/**
 * 上传文件
 */
export const postUploadFile = (params: FormData) => {
  return HttpRequest.post(
    {
      url: UploadApi.uploadFile,
      params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 下载文件
 */
export const postDownlFile = (id: string) => {
  return HttpRequest.get(
    {
      url: UploadApi.downloadFile + id,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}

/**
 * 预览文件
 */
export const postPreviewFile = (id: string) => {
  return HttpRequest.get(
    {
      url: UploadApi.previewFile + id,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}
