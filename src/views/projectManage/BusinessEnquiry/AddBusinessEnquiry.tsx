import React, { useEffect } from 'react'
import { Col, DatePicker, Form, Input, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { AddBusinessEnquiryForm } from '../config'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'

export type AddBusinessEnquiryProps = {
  params: {
    visible: boolean
    currentRow: BusinessEnquiryType | null
    source: 'BusinessEnquiry' | 'SaleProject'
  }
  onOk: (params: BusinessEnquiryType) => void
  onCancel: () => void
}

const AddBusinessEnquiry: React.FC<AddBusinessEnquiryProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, source } = params

  const essential = useSelector((state: RootState) => state.essentail)

  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    if (!currentRow) {
      form.resetFields()
      form.setFieldsValue({
        status: 'PENDING_PURCHASE',
        isInquiry: source === 'BusinessEnquiry' ? 1 : 0,
      })
    } else {
      form.setFieldsValue({
        ...currentRow,
        isInquiry: source === 'BusinessEnquiry' ? 1 : 0,
        estimatedPurchaseTime: dayjs(currentRow.estimatedPurchaseTime),
      })
    }
  }, [visible])

  const getBusinessEnquiryForm = () => {
    let arr = [...AddBusinessEnquiryForm]
    let { userData, customerData, contractingData, payerUnitData } = essential
    arr.map((item) => {
      if (
        item.name === 'customerId' ||
        item.name === 'salespersonId' ||
        item.name === 'entrustId' ||
        item.name === 'companyId'
      ) {
        item.options =
          item.name === 'customerId'
            ? customerData
            : item.name === 'salespersonId'
            ? userData
            : item.name === 'entrustId'
            ? contractingData
            : payerUnitData
      }
    })
    return arr
  }

  const selectChange = (
    item: Omit<CustomColumn, 'selectFetch' | 'hiddenItem'>
  ) => {
    if (item.name !== 'customerId') return
    else {
      let company = getBusinessEnquiryForm().find(
        (item) => item.name === 'customerId'
      )?.options as any[]
      form.setFieldsValue({
        ...form.getFieldsValue(),
        companyId: company?.find(
          (el) => el.id === form.getFieldValue('customerId')
        )?.companyId,
      })
    }
  }

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
      title={currentRow ? '编辑项目' : '创建项目'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 8 }} layout="vertical">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="status" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="isInquiry" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {getBusinessEnquiryForm().map((item) => (
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
                {item.formType === 'textarea' && (
                  <Input.TextArea
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
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'labal',
                        value: 'value',
                      }
                    }
                    allowClear
                    onChange={() => selectChange(item)}
                  />
                )}
                {item.formType === 'date-picker' && (
                  <DatePicker
                    placeholder={`请选择${item.label}`}
                    style={{ width: '100%' }}
                    allowClear
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
