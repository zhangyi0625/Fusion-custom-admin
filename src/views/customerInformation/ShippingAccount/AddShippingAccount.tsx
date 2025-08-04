import React, { useEffect, useState } from 'react'
import { Form, Input, Radio, Select, SelectProps } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import DragModal from '@/components/modal/DragModal'
import type { ShippingAccounType } from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import { ShippingAccountForm } from './config'

export type AddShippingAccountProps = {
  params: {
    visible: boolean
    currentRow: ShippingAccounType
    view: boolean
    type?: string | null
  }
  carrierOptions: SelectProps['options']
  customerOptions: SelectProps['options']
  onOk: (params: ShippingAccounType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const AddShippingAccount: React.FC<AddShippingAccountProps> = ({
  params,
  carrierOptions,
  customerOptions,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view, type } = params

  const [form] = Form.useForm()

  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue({ ...currentRow, type: type })
    } else {
      form.resetFields()
      setInitialValues({ type: type })
      form.setFieldsValue({ type: type })
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
      title={currentRow ? '编辑船司账号' : '新增船司账号'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} initialValues={initialValues}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {ShippingAccountForm.map((item) => (
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
            {item.formType === 'select' && (
              <Select
                placeholder={`请选择${item.label}`}
                filterOption
                options={
                  item.name === 'carrier' ? carrierOptions : customerOptions
                }
                fieldNames={
                  item.selectFileldName ?? {
                    label: 'labal',
                    value: 'value',
                    children: 'children',
                  }
                }
              />
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  )
}

export default AddShippingAccount
