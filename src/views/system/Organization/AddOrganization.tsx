import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, InputNumber, Select, type InputRef } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { SysOrganizationType } from '@/services/system/organization/organizationModel'
import { getOrganizationList } from '@/services/system/organization/organization'
import { AddOrganizationForm } from './config'

export interface AddOrganizationProps {
  params: {
    // 弹窗可见性
    visible: boolean
    // 弹窗需要的数据
    currentRow: SysOrganizationType | null
    // 组织机构父级Id
    parentId: string | null
  }
  // 点击确定的回调
  onOk: (params: SysOrganizationType) => void
  // 点击取消的回调
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const AddOrganization: React.FC<AddOrganizationProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, parentId } = params

  const [form] = Form.useForm()

  const organizationRef = useRef<InputRef>(null)

  const [formMap, setFormMap] = useState(AddOrganizationForm)

  useEffect(() => {
    if (!visible) return
    getAllOranization()
    if (currentRow) {
      // 填充表单数据
      form.setFieldsValue({
        ...currentRow,
        parentId: currentRow.parentId === '0' ? null : currentRow.parentId,
      })
    } else {
      // 清空表单数据，表示新增
      form.resetFields()
      form.setFieldsValue({
        parentId: parentId ?? null,
      })
    }
  }, [currentRow, visible])

  const getAllOranization = () => {
    getOrganizationList().then((resp) => {
      formMap.map((item) => {
        if (item.name === 'parentId') item.options = resp
      })
      setFormMap([...formMap])
    })
  }

  /**
   * 弹窗打开关闭的回调（打开后默认聚焦到名称输入框）
   * @param open 弹窗是否打开
   */
  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      organizationRef.current?.focus()
    }
  }

  /**
   * 点击确认的时候先做数据校验
   */
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
      title={currentRow ? '编辑组织机构' : '新增组织机构'}
      onOk={handleOk}
      onCancel={onCancel}
      afterOpenChange={onAfterOpenChange}
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item name="organizationId" hidden>
          <Input disabled />
        </Form.Item>
        {formMap.map((item) => (
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
            {item.formType === 'inputNumber' && (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder={`请输入${item.label}`}
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
                  String(option?.organizationName ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  )
}

export default AddOrganization
