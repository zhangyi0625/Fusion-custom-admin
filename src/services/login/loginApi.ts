import { HttpRequest } from '@/utils/request'
import type { Response } from '@/types/global'
import { ResetLoginPasswordType } from './loginModel'

/**
 * 枚举登录需要的接口地址
 */
export enum LoginApi {
  /**
   * 登录
   */
  login = '/supplier/login',

  /**
   * 退出登录
   */
  logout = '/logout',
  /**
   * 获取验证码
   */
  getCode = '/user/captcha',

  /**
   * 修改密码
   */
  updatePassword = '/supplier/changePassword',

  /**
   * 获取供应商账号信息
   */
  getSupplerAccountInfo = '/supplier/detail',
}

/**
 * 登录接口的实现
 */
export const login = (params: any) => {
  return HttpRequest.post<Response>(
    {
      url: LoginApi.login,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 获取验证码
 * @returns 验证码
 */
export const getCaptcha = (checkKey: string) => {
  return HttpRequest.get(
    {
      url: `${LoginApi.getCode}?${checkKey}`,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 用户退出登录
 * @param token 用户token
 */
export const logout = (token: string) => {
  HttpRequest.delete({ url: LoginApi.logout, params: { token } })
}

/**
 * 修改供应商账号密码
 */
export const updatePassword = (params: ResetLoginPasswordType) => {
  return HttpRequest.post<Response>(
    {
      url: LoginApi.updatePassword,
      data: params,
    },
    { isTransformResponse: false }
  )
}

/**
 * 获取验证码
 * @returns 验证码
 */
export const getSupplerAccountInfo = () => {
  return HttpRequest.get(
    {
      url: LoginApi.getSupplerAccountInfo,
    },
    {
      successMessageMode: 'none',
    }
  )
}
