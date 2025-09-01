import DragModal from '@/components/modal/DragModal'
import { Form, Input, Select } from 'antd'
import React, { useCallback } from 'react'

export type EditQuotationProps = {
  visible: boolean
  title: EditSettingOptionsType['title']
  onOk: (params: { modifyReason: string }) => void
  onCancel: () => void
}

interface EditSettingOptionsType {
  title: string
  textareaPlaceholder: string
  textareaName: string
  textareaLabel: string
}

const EditSettingOptions: EditSettingOptionsType[] = [
  {
    title: '修改报价表理由',
    textareaName: 'modifyReason',
    textareaPlaceholder: '请输入你修改报价表的理由',
    textareaLabel: '理由',
  },
  {
    title: '拒绝通过原因',
    textareaName: 'modifyReason',
    textareaPlaceholder: '请输入你拒绝通过的原因',
    textareaLabel: '理由',
  },
]

const EditQuotation: React.FC<EditQuotationProps> = ({
  visible,
  title,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

  const getEditSettingOptions = useCallback(() => {
    return EditSettingOptions.find((item) => item.title === title) ?? null
  }, [visible, title])

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
      title={getEditSettingOptions()?.title}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item
          label={getEditSettingOptions()?.textareaLabel}
          name={getEditSettingOptions()?.textareaName}
          rules={[
            {
              required: true,
              message: getEditSettingOptions()?.textareaPlaceholder,
            },
          ]}
        >
          <Input.TextArea
            placeholder={getEditSettingOptions()?.textareaPlaceholder}
            allowClear
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default EditQuotation
