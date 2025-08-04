import React, { useEffect, useRef } from 'react'
import { Form, Input, InputNumber, Select, type InputRef } from 'antd'
import { SelectProps } from 'antd/lib'
import DragModal from '@/components/modal/DragModal'
import type { SysDictionaryType } from '@/services/system/dictionary/dictionaryModel'

export type DictonaryModalProps = {
  params: {
    // 弹窗可见性
    visible: boolean
    // 弹窗需要的数据
    currentRow: SysDictionaryType | null
    view: boolean
  }
  dictionaryClass: { id: string; name: string }[]
  defaultdictId: string | null
  // 点击确定的回调
  onOk: (params: SysDictionaryType) => void
  // 点击取消的回调
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const DictonaryModal: React.FC<DictonaryModalProps> = ({
  params,
  dictionaryClass,
  defaultdictId,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow, view } = params

  const [form] = Form.useForm()

  const dictNameRef = useRef<InputRef>(null)

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      // 填充表单数据
      form.setFieldsValue(currentRow)
    } else {
      // 清空表单数据，表示新增
      form.resetFields()
      defaultdictId && form.setFieldsValue({ dictId: defaultdictId })
    }
    console.log(dictionaryClass)
  }, [currentRow, visible])

  /**
   * 弹窗打开关闭的回调（打开后默认聚焦到名称输入框）
   * @param open 弹窗是否打开
   */
  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      dictNameRef.current?.focus()
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
      title={currentRow ? '编辑字典分类' : '新增字典分类'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
      afterOpenChange={onAfterOpenChange}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="dictId"
          label="字典分类"
          rules={[{ required: true, message: '请选择字典分类' }]}
        >
          <Select
            placeholder="请选择字典分类"
            showSearch
            allowClear
            options={dictionaryClass as unknown as SelectProps['options']}
            fieldNames={{ value: 'id', label: 'name' }}
          />
        </Form.Item>
        <Form.Item
          name="dictDataName"
          label="字典项名称"
          rules={[{ required: true, message: '请输入字典项名称' }]}
        >
          <Input
            ref={dictNameRef}
            placeholder="请输入字典项名称"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="dictDataCode"
          label="字典项标识"
          rules={[{ required: true, message: '请输入字典项标识' }]}
        >
          <Input
            ref={dictNameRef}
            placeholder="请输入字典项标识"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="sortNumber"
          label="排序号"
          rules={[{ required: true, message: '请选择排序号' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="comments" label="备注">
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default DictonaryModal
