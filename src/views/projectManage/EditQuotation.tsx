import DragModal from '@/components/modal/DragModal'
import { Form, Input, Select } from 'antd'
import React from 'react'

export type EditQuotationProps = {
  visible: boolean
  onOk: (params: { id: string }) => void
  onCancel: () => void
}

const EditQuotation: React.FC<EditQuotationProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

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
      title="修改报价表理由"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item
          label="理由"
          name="reason"
          rules={[{ required: true, message: '请输入你修改报价表的理由' }]}
        >
          <Input.TextArea placeholder="请输入你修改报价表的理由" allowClear />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default EditQuotation
