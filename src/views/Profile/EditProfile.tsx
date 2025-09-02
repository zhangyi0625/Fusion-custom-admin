import React, { useState } from 'react'
import { Form, Input } from 'antd'
import DragModal from '@/components/modal/DragModal'

export type EditProfileProps = {
  params: {
    visible: boolean
    type: 'editPhone' | 'editPassword' | string
  }
  onOk: (params: any) => void
  onCancel: () => void
}

const EditProfile: React.FC<EditProfileProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, type } = params

  const [form] = Form.useForm()

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

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue() })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      width="40%"
      open={visible}
      title={type === 'editPhone' ? '修改手机号' : '修改登陆密码'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label={type === 'editPhone' ? '新手机号' : '手机号'}
          key="phone"
          name="phone"
          rules={[
            {
              required: true,
              message: '请输入新手机号',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号',
            },
          ]}
        >
          <Input
            disabled={type !== 'editPhone'}
            placeholder="请输入新手机号"
            autoComplete="off"
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="验证码"
          key="code"
          name="code"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
        >
          <Input
            placeholder="请输入验证码"
            autoComplete="off"
            addonAfter={
              <>
                {!isSendCheckCode ? (
                  <div
                    className="text-dull-500 cursor-pointer"
                    onClick={sendCode}
                  >
                    发送验证码
                  </div>
                ) : (
                  <div className="text-gray-500">({countdownNumber})s</div>
                )}
              </>
            }
            allowClear
          />
        </Form.Item>
        {type === 'editPassword' && (
          <Form.Item
            label="登陆密码"
            key="password"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入登录密码',
              },
            ]}
          >
            <Input placeholder="请输入登录密码" autoComplete="off" allowClear />
          </Form.Item>
        )}
      </Form>
    </DragModal>
  )
}

export default EditProfile
