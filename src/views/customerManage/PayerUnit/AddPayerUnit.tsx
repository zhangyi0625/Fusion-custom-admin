import React, { useEffect } from 'react'
import { Col, Form, Input, Radio, Row } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddPayerUnitForm } from '../config'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import type { PayerUnitType } from '@/services/customerManage/PayerUnit/PayerUnitModel'

export type AddPayerUnitProps = {
  params: {
    visible: boolean
    currentRow: PayerUnitType | null
  }
  onOk: (params: PayerUnitType) => void
  onCancel: () => void
}

const AddPayerUnit: React.FC<AddPayerUnitProps> = ({
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
      form.setFieldsValue({ ...currentRow, status: Number(currentRow.status) })
    } else {
      form.setFieldsValue({ status: 1 })
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
      title={currentRow ? '编辑付款单位' : '新增付款单位'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {AddPayerUnitForm.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                label={item.label}
                key={item.name}
                name={item.name}
                rules={
                  item.isRules
                    ? [
                        {
                          required: true,
                          message: `请${
                            item.formType === 'input' ? '输入' : '选择'
                          }${item.label}`,
                        },
                      ]
                    : undefined
                }
              >
                {item.formType === 'input' && (
                  <Input
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    allowClear
                  />
                )}
                {item.formType === 'radio' && (
                  <Radio.Group
                    options={
                      item.options as CheckboxGroupProps<string>['options']
                    }
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

export default AddPayerUnit
