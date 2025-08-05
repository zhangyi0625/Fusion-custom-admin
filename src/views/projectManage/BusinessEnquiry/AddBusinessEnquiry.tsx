import DragModal from '@/components/modal/DragModal'
import { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import React, { useEffect } from 'react'
import { AddBusinessEnquiryForm } from '../config'
import dayjs from 'dayjs'

export type AddBusinessEnquiryProps = {
  params: {
    visible: boolean
    currentRow: BusinessEnquiryType | null
  }
  onOk: (params: any) => void
  onCancel: () => void
}

const AddBusinessEnquiry: React.FC<AddBusinessEnquiryProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    if (!currentRow) form.resetFields()
    else {
      form.setFieldsValue({
        ...currentRow,
        expectedDate: dayjs(currentRow.expectedDate),
      })
    }
  }, [visible])

  const onConfirm = () => {
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
      width="55%"
      open={visible}
      title={currentRow ? '编辑商机' : '创建商机'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 8 }} layout="vertical">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {AddBusinessEnquiryForm.map((item) => (
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
                  />
                )}
                {item.formType === 'textarea' && (
                  <Input.TextArea
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                  />
                )}
                {item.formType === 'select' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={item.options}
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'labal',
                        value: 'value',
                      }
                    }
                  />
                )}
                {item.formType === 'date-picker' && (
                  <DatePicker
                    placeholder={`请选择${item.label}`}
                    style={{ width: '100%' }}
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

export default AddBusinessEnquiry
