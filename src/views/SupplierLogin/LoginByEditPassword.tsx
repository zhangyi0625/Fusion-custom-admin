import styles from './login.module.scss'
import React, { useRef, useState } from 'react'
import { Button, Form, Input } from 'antd'

export type LoginByEditPasswordProps = {
  onSave: () => void
  onLogin: () => void
}

const LoginByEditPassword: React.FC<LoginByEditPasswordProps> = ({
  onSave,
  onLogin,
}) => {
  const [form] = Form.useForm()

  const inputRef = useRef(null)

  const [loading, setLoading] = useState<boolean>(false)

  const [isSendCheckCode, setIsSendCheckCode] = useState<boolean>(false)

  const [countdownNumber, setCountdownNumber] = useState<number>(60)

  const sendCode = () => {
    setIsSendCheckCode(true)
    const timer = setInterval(function () {
      setCountdownNumber((prev) => prev - 1)
      if (countdownNumber === 0) {
        setIsSendCheckCode(false)
        setCountdownNumber(60)
        clearInterval(timer)
      }
    }, 1e3)
  }

  const onFinish = (value: any) => {
    console.log(value, 'value')
    setLoading(true)
    onSave()
  }
  return (
    <Form
      form={form}
      name="login"
      labelCol={{ span: 5 }}
      size="large"
      autoComplete="off"
      colon={false}
      onFinish={onFinish}
    >
      <div className={styles['login-form-item']}>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
          label="手机号"
        >
          <Input
            size="large"
            ref={inputRef}
            className={styles['customer-input']}
            autoComplete="off"
            allowClear
            placeholder="请输入手机号"
          />
        </Form.Item>
      </div>
      <div className={styles['login-form-item']}>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入验证码' }]}
          label="验证码"
        >
          <Input
            size="large"
            allowClear
            className={styles['customer-input']}
            autoComplete="off"
            placeholder="请输入验证码"
            suffix={
              <>
                {!isSendCheckCode ? (
                  <div
                    className="text-blue-500 cursor-pointer"
                    onClick={sendCode}
                  >
                    发送验证码
                  </div>
                ) : (
                  <div className="text-gray-500">
                    再次获取({countdownNumber})s
                  </div>
                )}
              </>
            }
          />
        </Form.Item>
      </div>
      <div className={styles['login-form-item']}>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入新密码' }]}
          label="新密码"
        >
          <Input
            size="large"
            allowClear
            className={styles['customer-input']}
            autoComplete="off"
            placeholder="请输入新密码"
          />
        </Form.Item>
      </div>
      <Form.Item>
        <Button
          loading={loading}
          size="large"
          style={{ width: '100%', marginTop: '30px' }}
          type="primary"
          htmlType="submit"
        >
          保存
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          style={{ width: '100%', marginTop: '30px' }}
          type="link"
          onClick={onLogin}
        >
          登陆
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginByEditPassword
