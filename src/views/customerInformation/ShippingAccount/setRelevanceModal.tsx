import React, { useEffect } from 'react'
import { Form, Select } from 'antd'
import type { ServiceSettingType } from '@/services/setting/serviceSettingModel'
import DragModal from '@/components/modal/DragModal'

export type SetRelevanceModalProps = {
  visible: boolean
  revelanceOptions: ServiceSettingType[]
  onOk: (params: { serverNo: string }) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const SetRelevanceModal: React.FC<SetRelevanceModalProps> = ({
  visible,
  revelanceOptions,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    form.resetFields()
  }, [visible])

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
      open={visible}
      width={'40%'}
      title="关联服务"
      onOk={handleOk}
      onCancel={onCancel}
      okText="保存"
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label="服务名"
          name="serverNo"
          rules={[{ required: true, message: '请选择服务名' }]}
        >
          <Select
            allowClear
            placeholder="请选择服务名"
            showSearch
            options={revelanceOptions}
            fieldNames={{ label: 'serverName', value: 'serverNo' }}
            filterOption={(input, option) =>
              String(option?.serverName ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default SetRelevanceModal
