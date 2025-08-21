import React, { useEffect, useRef, useState } from 'react'
import { Form, Input, InputNumber, Select, type InputRef } from 'antd'
import DragModal from '@/components/modal/DragModal'
import type { SysOrganizationType } from '@/services/system/organization/organizationModel'
import { getOrganizationList } from '@/services/system/organization/organization'

export interface AddOrganizationProps {
  params: {
    // 弹窗可见性
    visible: boolean
    // 弹窗需要的数据
    currentRow: SysOrganizationType | null
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
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  const organizationRef = useRef<InputRef>(null)

  const [organization, setOrganization] = useState([])

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
    }
  }, [currentRow, visible])

  const getAllOranization = () => {
    getOrganizationList().then((resp) => {
      setOrganization(resp)
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
        <Form.Item name="parentId" label="上级机构">
          <Select
            options={organization}
            fieldNames={{ label: 'organizationName', value: 'organizationId' }}
            showSearch
            allowClear
            placeholder="选择上级机构"
          />
        </Form.Item>
        <Form.Item
          name="organizationName"
          label="机构名称"
          rules={[{ required: true, message: '请输入机构名称' }]}
        >
          <Input
            ref={organizationRef}
            placeholder="请输入机构名称"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="organizationCode"
          label="机构代码"
          rules={[{ required: true, message: '请输入代码' }]}
        >
          <Input placeholder="请输入机构代码" autoComplete="off" />
        </Form.Item>
        <Form.Item name="organizationFullName" label="机构全称">
          <Input placeholder="请输入机构全称" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="organizationType"
          label="机构类型"
          rules={[{ required: true, message: '请输入机构类型' }]}
        >
          <Input placeholder="请输入机构类型" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="organizationTypeName"
          label="机构类型名称"
          rules={[{ required: true, message: '请输入机构类型名称' }]}
        >
          <Input placeholder="请输入机构类型名称" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="sortNumber"
          label="排序号"
          rules={[{ required: true, message: '请选择排序号' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="comments" label="组织备注">
          <Input.TextArea placeholder="请输入组织机构备注" />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default AddOrganization
