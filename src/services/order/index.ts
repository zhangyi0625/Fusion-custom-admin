import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'
import type { OrderSearchParams, ShippingScheduleParams } from './type'

/**
 * 枚举订单需要的接口地址
 */
export enum OrderApi {
  /**
   * 公司列表
   */
  affiliate = '/staff/customer/affiliate/list',
  /**
   * 用户列表
   */
  customer = '/staff/customer/list',
  /**
   * 港口列表
   */
  port = '/common/location/list',
  /**
   * 船司列表（全）
   */
  carrierAll = '/common/carrier/list',
  /**
   * 船司列表（下单）
   */
  carrier = '/common/carrier/brand/list',
  /**
   * 订单列表（普通）
   */
  order = '/staff/frt/order/page',
  /**
   * 订单列表详情（普通）
   */
  orderDetail = '/staff/frt/order/detail/',
  /**
   * 取消订舱
   */
  cancelBooking = '/staff/frt/order/closure/',
  /**
   * 审核通过开启订舱
   */
  startBooking = '/staff/frt/order/start/',
  /**
   * 设置订舱成功
   */
  settingBookingSuccess = '/staff/frt/order/success/',
  /**
   * 订舱执行违约
   */
  executionBreach = '/staff/frt/order/violated/',
  /**
   * 订单退款
   */
  bookingRefund = '/staff/frt/order/chargeback/',
  /**
   * 订单完成
   */
  bookingFinish = '/staff/frt/order/finish/',
  /**
   * 同意取消申请
   */
  agreeCancelApply = '/staff/frt/order/cancel/pass/',
  /**
   * 拒绝取消申请
   */
  rejectCancelApply = 'staff/frt/order/cancel/forbid/',
  /**
   * 登陆订单船司账号
   */
  loginOrderAccount = '/staff/frt/order/verify/account/',
  /**
   * 修改订舱频率
   */
  editBookingFrequency = '/staff/frt/order/prebooking/cron/',
  /**
   * 光速预定
   */
  fastOrder = '/staff/order/page',
  /**
   * 导出光速预定
   */
  exportFastOrder = '/staff/order/fastbooking/export',
  /**
   * 导出光速预定订单结果
   */
  exportFastOrderResult = '/staff/order/download/booking',
  /**
   * 拍舱结果列表
   */
  cabinResult = '/staff/fast/booking/page',
  /**
   * 导入拍舱结果
   */
  importCabinResult = '/staff/fast/booking/upload/excel/',
  /**
   * 批量发布舱位
   */
  batchProduct = '/staff/fast/booking/publish/product',
  /**
   * 取消关联舱位
   */
  onRelevance = '/staff/fast/booking/unbind',
  /**
   * 关联订舱结果
   */
  relevanceResult = '/staff/fast/booking/bind',
  /**
   * 船期数据
   */
  shippingSchedule = '/staff/product/getSchedules',
}

/**
 * 查询公司列表
 */
export const getSearchAffiliate = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.affiliate,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询用户列表
 */
export const getSearchCustomer = (params: { keyword?: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.customer,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询港口列表
 */
export const getSearchPort = (params: { keyword?: string; tag: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.port,
      params: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询船司列表
 */
export const getSearchCarrierAll = () => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.carrierAll,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询船司列表
 */
export const getSearchCarrier = () => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.carrier,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询订单列表（普通）
 * @param params
 * @returns
 */

export const getOrderOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.order,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询订单详情（普通）
 * @param id
 * @returns
 */

export const getOrderDetail = (id: string | number) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.orderDetail + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 取消订舱
 * @param data
 * @returns
 */

export const postCancelBooking = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.cancelBooking + id,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 开启订舱 接受订单, 订单状态转为处理中
 * @param id
 * @returns
 */

export const postStartBooking = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.startBooking + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱成功
 * @param id
 * @returns
 */

export const postBookingSuccess = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.settingBookingSuccess + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱执行违约
 * @param data
 * @returns
 */

export const postExecutionBreach = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.executionBreach + id,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱执行退款
 * @param id
 * @returns
 */

export const postBookingRefund = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.bookingRefund + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱执行结束
 * @param id
 * @returns
 */

export const postBookingFinish = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.bookingFinish + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱同意取消
 * @param id
 * @returns
 */

export const postAgreeCancelApply = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.agreeCancelApply + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 订舱拒绝取消
 * @param data
 * @returns
 */

export const postRejectCancelApply = (
  id: string | number,
  data: { remark: string }
) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.rejectCancelApply + id,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 登陆订舱账号
 * @param id
 * @returns
 */

export const postLoginOrderAccount = (id: string | number) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.loginOrderAccount + id,
    },
    { isTransformResponse: false }
  )
}

/**
 * 修改订舱频率
 * @param data
 * @returns
 */

export const postBookingFrequency = (
  id: string | number,
  data: Partial<{
    cronPattern: string
    frequencyType: string
    hourRange: string
  }>
) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.editBookingFrequency + id,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询光速预定
 * @param params
 * @returns
 */

export const getFastOrderOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.fastOrder,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 导出光速预定列表
 * @param params
 * @returns
 */

export const downFastOrder = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.exportFastOrder,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}

/**
 * 导出光速预定订单结果
 * @param params
 * @returns
 */

export const downOrderResult = (params: { ids: string }) => {
  return HttpRequest.get<Response>(
    {
      url: OrderApi.exportFastOrderResult,
      params: params,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询拍舱结果
 * @param params
 * @returns
 */

export const getCabinResultOptions = (params: OrderSearchParams) => {
  let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.cabinResult,
      params: qsParams,
    },
    { isTransformResponse: false }
  )
}

/**
 * 导入拍舱结果
 * @param data
 * @returns
 */

export const postCabinResult = (data: any) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.importCabinResult,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 批量发布舱位
 * @param data
 * @returns
 */

export const postBatchProduct = (data: string[]) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.batchProduct,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 取消关联舱位
 * @param data
 * @returns
 */

export const postOnRelevance = (data: { ids: string[] }) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.onRelevance,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 关联订舱结果
 * @param data
 * @returns
 */

export const postRelevanceResult = (data: {
  ids: string[]
  orderId: string
}) => {
  return HttpRequest.post<Response>(
    {
      url: OrderApi.relevanceResult,
      data: data,
    },
    { isTransformResponse: false }
  )
}

/**
 * 查询船期数据
 * @param params
 * @returns
 */

export const getShippingSchedule = (params: ShippingScheduleParams) => {
  // let qsParams = { ...params, filter: JSON.stringify(params.filter) }
  return HttpRequest.get<Response>(
    {
      url: OrderApi.shippingSchedule,
      params: params,
    },
    { isTransformResponse: false }
  )
}
