import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Radio, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddCustomerForm } from '../config'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'
import { getPayerUnit } from '@/services/customerManage/PayerUnit/PayerUnitApi'
import { getDictionaryListByIdPage } from '@/services/system/dictionary/dictionaryApi'

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
      form.setFieldsValue({
        ...currentRow,
        status: Number(currentRow.status),
        companyId: currentRow.companyId
          ? [currentRow.companyId]
          : currentRow.companyName
            ? [currentRow.companyName]
            : null,
      })
    } else {
      form.setFieldsValue({ status: 1 })
    }
    console.log(form.getFieldsValue(), 'customerForm', currentRow)
  }, [visible])

  const loadPayerUnit = async () => {
    // const res = await getPayerUnit()
    // const result = await getDictionaryListByIdPage({
    //   dictId: '2046798065079304194',
    // })
    Promise.all([
      getPayerUnit(),
      getDictionaryListByIdPage({
        dictId: '2046798065079304194',
      }),
      getDictionaryListByIdPage({
        dictId: '2047198836761444353',
      }),
    ])
      .then((resp) => {
        customerForm.map((item) => {
          if (item.formType === 'select' && item.label === '单位名称') {
            item.options = resp[0]
          } else if (item.formType === 'select' && item.label === '客户级别') {
            item.options = resp[1].list.map((el: { dictDataName: string }) => ({
              label: el.dictDataName,
              value: el.dictDataName,
            }))
          } else if (item.formType === 'select' && item.label === '客户来源') {
            item.options = resp[2].list.map((el: { dictDataName: string }) => ({
              label: el.dictDataName,
              value: el.dictDataName,
            }))
          }
        })
        setCustomerForm([...customerForm])
      })
      .catch((error) => {
        console.log(error, 'error')
      })

    // setCustomerForm([...customerForm])
  }

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue()
        let company = customerForm.find((item) => item.label === '单位名称')
          ?.options as any[]
        let isCreateCompany =
          company?.find((el) => el.id === formValues.companyId[0])?.id ?? null
        console.log(isCreateCompany, 'is', company, formValues)

        onOk({
          ...formValues,
          companyId: isCreateCompany,
          companyName: !isCreateCompany ? formValues.companyId[0] : '',
        })
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
                        item.name === 'phone'
                          ? {
                              pattern: /^1[3-9]\d{9}$/,
                              message: '请输入正确的手机号',
                            }
                          : {},
                      ]
                    : undefined
                }
              >
                {item.formType === 'select' && item.label === '单位名称' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    options={item.options}
                    allowClear
                    mode="tags"
                    maxCount={1}
                    fieldNames={
                      item.selectFieldName ?? {
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
                {item.formType === 'select' && item.label !== '单位名称' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    options={item.options}
                    allowClear
                    fieldNames={
                      item.selectFieldName ?? {
                        label: 'label',
                        value: 'value',
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
                {item.formType === 'textarea' && (
                  <Input.TextArea
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
