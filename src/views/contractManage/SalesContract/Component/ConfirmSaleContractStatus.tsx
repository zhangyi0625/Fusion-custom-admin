import React, { useCallback, useEffect } from 'react'
import { Form, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddSalesContractForm } from '../../config'
import { SaleContractType } from '@/services/contractManage/SalesContract/SalesContractModel'

export type ConfirmSaleContractStatusProps = {
  params: {
    visible: boolean
    currentRow: SaleContractType | null
  }
  onOk: (currentRow: SaleContractType) => void
  onCancel: () => void
}

const ConfirmSaleContractStatus: React.FC<ConfirmSaleContractStatusProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  const options = useCallback(() => {
    let options = AddSalesContractForm.find(
      (item) => item.name === 'status'
    )?.options
    return options
  }, [visible])

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (currentRow) {
      form.setFieldsValue({
        status: currentRow.status,
      })
    }
  }, [visible])

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...currentRow, ...form.getFieldsValue() })
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
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item label="合同状态" key="status" name="status">
          <Select
            placeholder="请选择合同状态"
            filterOption
            options={options()}
            allowClear
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default ConfirmSaleContractStatus
