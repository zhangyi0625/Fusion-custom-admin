import React, { useEffect, useState } from 'react'
import { Form, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { getSupplier } from '@/services/supplierManage/Supplier/SupplierApi'
import type { SupplierType } from '@/services/supplierManage/Supplier/SupplierModel'

export type ConfirmQuotationProps = {
  visible: boolean
  onOk: (params: { supplierId: string }) => void
  onCancel: () => void
}

const ConfirmQuotation: React.FC<ConfirmQuotationProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

  const [supplierOptions, setsupplierOptions] = useState<SupplierType[]>([])

  useEffect(() => {
    if (!visible) return
    loadSupplierOptions()
  }, [visible])

  const loadSupplierOptions = async () => {
    const res = await getSupplier({})
    setsupplierOptions(res)
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
      title="确认报价"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item
          label="供应商"
          name="supplierId"
          rules={[
            {
              required: true,
              message: '请选择确认报价的供应商',
            },
          ]}
        >
          <Select
            allowClear
            placeholder="请选择确认报价的供应商"
            showSearch
            options={supplierOptions}
            fieldNames={{
              label: 'name',
              value: 'id',
            }}
            filterOption={(input, option) =>
              String(option?.name ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default ConfirmQuotation
