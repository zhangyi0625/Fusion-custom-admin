import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Col, Form, Image, Input, Row } from 'antd'
import logo from '@/assets/images/icon-512.png'
import {
  LockOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons'
import styles from './login.module.scss'
import { useNavigate } from 'react-router-dom'
import { getCaptcha, login } from '@/services/login/loginApi'
import { useDispatch } from 'react-redux'
import { setMenus } from '@/stores/store'
import { HttpCodeEnum } from '@/enums/httpEnum'
import { antdUtils } from '@/utils/antdUtil'
import { MenuModel } from '@/services/system/menu/menuModel'
import { buildTree } from '@/utils/tool'
import { getRoleMenu } from '@/services/system/role/roleApi'

/**
 * 登录模块
 * @returns 组件内容
 */
const Login: React.FC = () => {
  const [form] = Form.useForm()

  const inputRef = useRef(null)

  const navigate = useNavigate()

  const dispatch = useDispatch()
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 验证码（后续更改从后端获取）
  const [code, setCode] = useState<{
    base64: string
    text: string
    verifyKey?: string
  }>()
  // 验证码的校验key，获取验证码的时候返回，用于验证码的校验
  const [checkKey, setCheckKey] = useState<string>('')

  // 页面挂载请求后端获取验证码
  useEffect(() => {
    getCode()
  }, [])

  /**
   * 登录表单提交
   * @param values 提交表单的数据
   */
  const submit = async (values: any) => {
    // 加入验证码校验key
    values.verifyKey = checkKey
    setLoading(true)
    // 这里考虑返回的内容不仅包括token，还包括用户登录的角色（需要存储在本地，用于刷新页面时重新根据角色获取菜单）、配置的首页地址（供登录后进行跳转）
    try {
      const { code, data, message } = await login(values)
      // 根据code判定登录状态（和枚举的状态码进行判定） 只会存在几种情况，用户名不存在，用户名或密码错误，用户名冻结，验证码错误或者过期
      // case中使用{}包裹的目的是为了保证变量做用于仅限于case块
      switch (code) {
        // 用户名不存在或禁用
        case HttpCodeEnum.RC107:
        case HttpCodeEnum.RC102:
          form.setFields([{ name: 'username', errors: [message] }])
          form.getFieldInstance('username').focus()
          // 刷新验证码
          getCode()
          break
        // 密码输入错误
        case HttpCodeEnum.RC108:
          form.setFields([{ name: 'password', errors: [message] }])
          form.getFieldInstance('password').focus()
          // 刷新验证码
          getCode()
          break
        // 验证码错误或过期
        case HttpCodeEnum.RC300:
        case HttpCodeEnum.RC301:
          form.setFields([{ name: 'captcha', errors: [message] }])
          form.getFieldInstance('captcha').focus()
          // 刷新验证码
          getCode()
          break
        // 登录成功
        case HttpCodeEnum.SUCCESS:
          {
            let roleId = data.user?.userId
            // 没有配置首页地址默认跳到第一个菜单
            let { homePath } = data
            sessionStorage.setItem('token', data.access_token)
            sessionStorage.setItem('isLogin', 'true')
            sessionStorage.setItem('roleId', roleId)
            // 存储登录的用户名
            sessionStorage.setItem('loginUser', data.user?.username)
            const menu = await getRoleMenu(roleId)
            // return
            dispatch(setMenus(buildTree(menu, 'menuId')))
            // 判断是否配置了默认跳转的首页地址
            if (!homePath) {
              // 获取第一个是路由的地址
              const firstRoute = menu.find(
                (item: { menuType: number }) => item.menuType === 0
              )
              if (firstRoute) {
                homePath = firstRoute.path
              }
            }

            // 跳转到首页
            navigate(homePath)
            antdUtils.notification?.success({
              message: '登录成功',
              description: '欢迎来到在舱光速抢舱管理平台!',
            })
          }
          break
        default:
          // 默认按登录失败处理
          antdUtils.modal?.error({
            title: '登录失败',
            content: (
              <>
                <p>错误状态码:{code}</p>
                <p>失败原因:{message}</p>
              </>
            ),
          })
          // 刷新验证码
          getCode()
          break
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 获取验证码
   */
  const getCode = async () => {
    // 时间key
    const key = new Date().getTime().toString()
    const code = await getCaptcha(key)
    setCode(code)
    setCheckKey(code?.verifyKey)
  }

  return (
    <>
      <div className={styles.dragArea} />
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          {/* 左边图案和标题 */}
          <div className={styles['login-left']}>
            <div className="logo mt-[60]">
              <img
                className="login-icon my-0 mx-auto"
                width="70"
                src={logo}
                alt="logo"
              />
            </div>
            <div className="title">
              <p style={{ fontSize: '20px', margin: 0 }}>
                <span
                  style={{
                    fontFamily:
                      '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  融合管理平台
                </span>
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                <span
                  style={{
                    fontFamily: '微软雅黑, sans-serif',
                    fontWeight: 400,
                    color: '#999999',
                  }}
                >
                  销售协同管理系统
                </span>
              </p>
            </div>
          </div>
          {/* 右边登陆表单 */}
          <div className={styles['login-form']}>
            <div className="login-title">
              <p style={{ fontSize: '28px', textAlign: 'center', margin: 0 }}>
                <span
                  style={{
                    fontFamily:
                      '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  用户登录
                </span>
              </p>
            </div>
            <div className="form" style={{ marginTop: '40px' }}>
              <Form
                form={form}
                name="login"
                labelCol={{ span: 5 }}
                initialValues={{
                  username: 'admin',
                  password: '123456',
                  remember: true,
                }}
                size="large"
                autoComplete="off"
                onFinish={submit}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    size="large"
                    ref={inputRef}
                    autoFocus
                    autoComplete="off"
                    allowClear
                    placeholder="用户名：admin"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    size="large"
                    allowClear
                    autoComplete="off"
                    placeholder="密码：123456qwe,."
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                <Form.Item>
                  <Row gutter={8}>
                    <Col span={18}>
                      <Form.Item
                        name="verifyCode"
                        noStyle
                        rules={[{ required: true, message: '请输入验证码' }]}
                      >
                        <Input
                          size="large"
                          allowClear
                          placeholder="输入右侧验证码"
                          prefix={<SecurityScanOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Button
                        size="large"
                        onClick={getCode}
                        style={{
                          width: '100%',
                          backgroundColor: '#f0f0f0',
                          padding: '2px',
                        }}
                      >
                        <Image
                          src={code?.base64}
                          preview={false}
                          width="100%"
                          height="100%"
                        />
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                {/* 记住密码 */}
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    size="large"
                    style={{ width: '100%' }}
                    type="primary"
                    htmlType="submit"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login
