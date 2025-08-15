import React, { useEffect } from 'react'
import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { SaleContractNoteType } from '@/services/contractManage/SalesContract/SalesContractModel'
import { AddSalesContractNoteForm } from '../../config'
import dayjs from 'dayjs'

export type AddSalesContractNoteProps = {
  params: {
    visible: boolean
    currentRow: SaleContractNoteType | null
  }
  onOk: (params: SaleContractNoteType) => void
  onCancel: () => void
}

const AddSalesContractNote: React.FC<AddSalesContractNoteProps> = ({
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
      form.setFieldsValue({
        ...currentRow,
        invoiceDate: dayjs(currentRow.invoiceDate),
      })
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
      title={currentRow ? '编辑款项合同' : '新建款项合同'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {AddSalesContractNoteForm.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item label={item.label} key={item.name} name={item.name}>
                {item.formType === 'input' && (
                  <Input
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    allowClear
                  />
                )}
                {item.formType === 'select' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={item.options}
                    allowClear
                  />
                )}
                {item.formType === 'date-picker' && (
                  <DatePicker
                    style={{ width: '100%' }}
                    format={'YY-MM-DD HH:mm:ss'}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  )
}

export default AddSalesContractNote
