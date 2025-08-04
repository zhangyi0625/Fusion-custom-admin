import { useEffect, useRef } from 'react'
import { Form, Input, type InputRef } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { SysRoleType } from '@/services/system/role/roleModel'

const RoleInfoModal: React.FC<RoleInfoModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  // 表单实例
  const [form] = Form.useForm()

  const roleNameRef = useRef<InputRef>(null)

  const { visible, currentRow, view } = params

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      // 填充表单数据
      form.setFieldsValue(currentRow)
    } else {
      // 清空表单数据，表示新增
      form.resetFields()
    }
  }, [currentRow, visible])

  /**
   * 弹窗打开关闭的回调（打开后默认聚焦到名称输入框）
   * @param open 弹窗是否打开
   */
  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      roleNameRef.current?.focus()
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
      title={currentRow ? '编辑角色' : '新增角色'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
      afterOpenChange={onAfterOpenChange}
    >
      <Form form={form} labelCol={{ span: 4 }} disabled={view}>
        <Form.Item name="roleId" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input
            ref={roleNameRef}
            placeholder="请输入角色名称"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item name="comments" label="角色备注">
          <Input.TextArea placeholder="请输入角色备注" />
        </Form.Item>
      </Form>
    </DragModal>
  )
}
export default RoleInfoModal

export type RoleInfoModalProps = {
  params: {
    // 弹窗可见性
    visible: boolean
    // 弹窗需要的数据
    currentRow: Record<string, any> | null
    view: boolean
  }

  // 点击确定的回调
  onOk: (params: SysRoleType) => void
  // 点击取消的回调
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}
