import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import DragModal from '@/components/modal/DragModal'

export type AddContractingUnitsProps = {
  params: {
    visible: boolean
    currentRow: { name: string } | null
  }
  onOk: (params: { name: string }) => void
  onCancel: () => void
}

const AddContractingUnits: React.FC<AddContractingUnitsProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

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
      title={currentRow ? '编辑单位' : '新增单位'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="签约单位"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入签约单位',
            },
          ]}
        >
          <Input placeholder="请输入签约单位" autoComplete="off" allowClear />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default AddContractingUnits
