import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddContractsForm } from '../config'
import type { ContractsType } from '@/services/supplierManage/Contracts/ContractsModel'
import { getSupplier } from '@/services/supplierManage/Supplier/SupplierApi'

export type AddContractProps = {
  params: {
    visible: boolean
    currentRow: ContractsType | null
    source: 'Supplier' | null
  }
  onOk: (params: ContractsType) => void
  onCancel: () => void
}

const AddContract: React.FC<AddContractProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow, source } = params

  const [form] = Form.useForm()

  const [contractsForm, setContractsForm] = useState(AddContractsForm)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    !source && loadSupplierList()
    if (currentRow) {
      form.setFieldsValue({ ...currentRow })
    }
  }, [visible])

  const loadSupplierList = async () => {
    const res = await getSupplier({})
    contractsForm.map((item) => {
      if (item.formType === 'select') {
        item.options = res
        item.hiddenItem = false
      }
    })
    console.log(contractsForm, 'contractName')
    setContractsForm([...contractsForm])
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
      title={currentRow ? '编辑联系人' : '新增联系人'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {contractsForm.map(
            (item) =>
              !item.hiddenItem && (
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
                    {item.formType === 'select' && !source && (
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
                  </Form.Item>
                </Col>
              )
          )}
        </Row>
      </Form>
    </DragModal>
  )
}

export default AddContract
