import DragModal from '@/components/modal/DragModal'
import { ProductManageClassType } from '@/services/productManage/productManageModel'
import { Form, Input, InputNumber } from 'antd'
import React, { useEffect } from 'react'

export type AddProductClassProps = {
  params: {
    visible: boolean
    currentRow: ProductManageClassType | null
    name?: string | null
  }
  onOk: (params: ProductManageClassType) => void
  onCancel: () => void
}

const AddProductClass: React.FC<AddProductClassProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow, name } = params

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (currentRow) {
      form.setFieldsValue(currentRow)
    }
  }, [visible])

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
      title={currentRow ? `编辑${name}` : `新增${name}`}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label={name}
          name="name"
          rules={[
            {
              required: true,
              message: `请输入${name}`,
            },
          ]}
        >
          <Input placeholder={`请输入${name}`} autoComplete="off" allowClear />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} autoComplete="off" style={{ width: '200px' }} />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default AddProductClass
