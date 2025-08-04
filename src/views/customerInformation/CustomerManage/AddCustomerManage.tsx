import DragModal from '@/components/modal/DragModal'
import { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'
import { Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { CustomerManageForm } from './config'

export type AddCustomerManageProps = {
  params: {
    visible: boolean
    currentRow: CustomerManageType
    view: boolean
  }
  onOk: (params: CustomerManageType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const AddCustomerManage: React.FC<AddCustomerManageProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue(currentRow)
    } else {
      form.resetFields()
    }
  }, [visible, view])

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldsValue())
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
      title={currentRow ? '编辑客户' : '新增客户'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {CustomerManageForm.map((item) => (
          <Form.Item
            label={item.label}
            key={item.name}
            name={item.name}
            rules={[
              {
                required: true,
                message: `请${item.formType === 'input' ? '输入' : '选择'}${
                  item.label
                }`,
              },
            ]}
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  )
}

export default AddCustomerManage
