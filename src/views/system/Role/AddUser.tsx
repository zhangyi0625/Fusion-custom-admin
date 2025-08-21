import { useEffect, useRef, useState } from 'react'
import {
  Col,
  Form,
  GetProp,
  Input,
  type InputRef,
  Row,
  Select,
  TreeSelect,
  TreeSelectProps,
} from 'antd'
import DragModal from '@/components/modal/DragModal'
import { editRole, getRoleList } from '@/services/system/role/roleApi'
import { getOrganizationList } from '@/services/system/organization/organization'
import type { SysRoleType, SysUserType } from '@/services/system/role/roleModel'
import { buildTree } from '@/utils/tool'

export interface AddUserProps {
  open: {
    visible: boolean
    editRow: SysUserType | null
  }
  // 当前角色
  roleId: string | null
  // 点击确定(选中的数量)
  onOk: (params: SysUserType) => void
  onCancel: () => void
}

type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number]

/**
 * 添加用户弹窗
 * @returns
 */
const AddUser: React.FC<AddUserProps> = ({ open, onOk, onCancel, roleId }) => {
  const [form] = Form.useForm()

  const [role, setRole] = useState<SysRoleType[]>([])

  const ref = useRef<InputRef>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>(
    []
  )

  useEffect(() => {
    if (!open.visible) return
    // 获取所有角色和组织机构
    init()
    if (open.editRow) {
      form.setFieldsValue({
        ...open.editRow,
        roles: open.editRow?.roles.map((el: { roleId: string }) => el.roleId),
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ roles: roleId ? [roleId] : [] })
    }
    console.log(open.editRow, form.getFieldsValue())
  }, [open.visible])

  const init = () => {
    setLoading(true)
    Promise.all([getOrganizationList(), getRoleList()]).then((result) => {
      setTreeData(buildTree(result[0], 'organizationId'))
      setRole(result[1])
      setLoading(false)
    })
  }

  /**
   * 点击确定的操作
   */
  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...form.getFieldsValue(),
          roles:
            role.filter((item) =>
              form.getFieldValue('roles').includes(item.roleId)
            ) ?? [],
        })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  const cancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <DragModal
      open={open.visible}
      onCancel={cancel}
      title={!open.editRow ? '添加用户' : '修改用户'}
      width={{ xl: 800, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item name="userId" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="用户账号"
              name="username"
              rules={[{ required: true, message: '请输入用户账号' }]}
            >
              <Input
                placeholder="请输入用户名"
                autoFocus
                allowClear
                autoComplete="off"
                ref={ref}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="手机号"
              name="phone"
              rules={[
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号',
                },
                { required: true, message: '请输入手机号' },
              ]}
            >
              <Input
                placeholder="请输入用户名"
                autoFocus
                allowClear
                autoComplete="off"
                ref={ref}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="所属机构"
              name="organizationId"
              rules={[{ required: true, message: '请选择所属机构' }]}
            >
              <TreeSelect
                styles={{
                  popup: { root: { maxHeight: 400, overflow: 'auto' } },
                }}
                treeData={treeData}
                placeholder="请选择所属机构"
                fieldNames={{
                  label: 'organizationName',
                  value: 'organizationId',
                  children: 'children',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="登陆密码"
              name="password"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (
                      value &&
                      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)
                    ) {
                      return Promise.reject('密码需包含字母和数字且至少6位')
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                placeholder="请输入登录密码"
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="姓名"
              name="nickname"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" allowClear autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className="mb-0" label="角色" name="roles">
              <Select
                mode="multiple"
                options={role.map((item: SysRoleType) => ({
                  label: item.roleName,
                  value: item.roleId,
                }))}
                placeholder="请选择角色"
                allowClear
                filterOption
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="邮箱"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '请输入正确的邮箱',
                },
              ]}
            >
              <Input placeholder="请输入邮箱" allowClear autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className="mb-0" label="个人简介" name="introduction">
              <Input.TextArea placeholder="请输入个人简介" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DragModal>
  )
}
export default AddUser
