import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Radio, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddCustomerForm, AddPayerUnitForm } from '../config'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'
import {
  getPayerUnit,
  getPayerUnitByPage,
} from '@/services/customerManage/PayerUnit/PayerUnitApi'

export type AddCustomerProps = {
  params: {
    visible: boolean
    currentRow: CustomerType | null
  }
  onOk: (params: CustomerType) => void
  onCancel: () => void
}

const AddCustomer: React.FC<AddCustomerProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  const [customerForm, setCustomerForm] = useState(AddCustomerForm)

  useEffect(() => {
    if (!visible) return
    loadPayerUnit()
    form.resetFields()
    if (currentRow) {
      form.setFieldsValue({ ...currentRow, status: Number(currentRow.status) })
    } else {
      form.setFieldsValue({ status: 1 })
    }
  }, [visible])

  const loadPayerUnit = async () => {
    const res = await getPayerUnit()
    customerForm.map((item) => {
      if (item.formType === 'select') {
        item.options = res
      }
    })
    setCustomerForm([...customerForm])
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
      title={currentRow ? '编辑客户' : '新增客户'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {customerForm.map((item) => (
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
                {item.formType === 'select' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    options={item.options}
                    allowClear
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'name',
                        value: 'id',
                      }
                    }
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.name ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                )}
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

export default AddCustomer
