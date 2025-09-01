import React, { useCallback, useEffect } from 'react'
import { Col, Form, Input, Radio, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { ProductManageType } from '@/services/productManage/productManageModel'
import { AddProductForm } from '../config'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export type AddProductProps = {
  params: {
    visible: boolean
    currentRow: ProductManageType | null
  }
  type: 'systemProducts' | 'customizedProducts'
  ProductSearchColumns: CustomColumn[]
  onOk: (params: ProductManageType) => void
  onCancel: () => void
}

const AddProduct: React.FC<AddProductProps> = ({
  params,
  ProductSearchColumns,
  type,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  const getAddProductForm = useCallback(() => {
    ProductSearchColumns.map((item) => {
      for (let el of AddProductForm) {
        if (item.name === el.name && el.formType === 'normalSelect') {
          el.options = item.options
        }
      }
    })
    return AddProductForm
  }, [ProductSearchColumns, type])

  const getCustomizedProducts = useCallback(() => {
    let key = ['model', 'volt', 'spec', 'unit']
    let arr = AddProductForm.filter((item) => key.includes(item.name))
    let newArr = arr.map((item) => {
      return {
        ...item,
        formType: 'input',
        span: 24,
      }
    })
    return newArr
  }, [AddProductForm, type])

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
        let name =
          form.getFieldValue('model') +
          '-' +
          form.getFieldValue('volt') +
          '-' +
          form.getFieldValue('spec')
        onOk({ ...form.getFieldsValue(), name: name })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }
  return (
    <DragModal
      width={type === 'customizedProducts' ? '45%' : '50%'}
      open={visible}
      title={currentRow ? '编辑产品' : '新增产品'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 8 }} layout="vertical">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="name" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {(
            ((type === 'systemProducts'
              ? getAddProductForm()
              : getCustomizedProducts()) as CustomColumn[]) ?? []
          ).map((item) => (
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
                labelCol={{
                  span:
                    item.formType === 'radio' || type === 'customizedProducts'
                      ? 3
                      : 8,
                }}
                layout={
                  item.formType === 'radio' || type === 'customizedProducts'
                    ? 'horizontal'
                    : 'vertical'
                }
              >
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
                {item.formType === 'normalSelect' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    options={item.options}
                    allowClear
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'name',
                        value: 'name',
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

export default AddProduct
