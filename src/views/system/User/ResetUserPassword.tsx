import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { SysUserType } from '@/services/system/role/roleModel'

export type ResetUserPasswordProps = {
  params: {
    visible: boolean
    currentRow: Pick<SysUserType, 'userId' | 'username' | 'password'> | null
  }
  onOk: (params: SysUserType) => void
  onCancel: () => void
}

const ResetUserPassword: React.FC<ResetUserPasswordProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue({ ...currentRow, password: null })
    }
  }, [visible])

  const handleOk = () => {
    onOk(form.getFieldsValue())
  }

  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="重置用户密码"
      width="40%"
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item name="userId" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="username" hidden>
          <Input />
        </Form.Item>
        <Form.Item className="mb-0" label="重置密码" name="password">
          <Input.Password
            placeholder="请输入重置密码"
            allowClear
            autoComplete="off"
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default ResetUserPassword
