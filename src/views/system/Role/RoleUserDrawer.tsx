import { useEffect, useRef, useState } from 'react'
import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  type InputRef,
  Row,
  Space,
  Switch,
  Table,
  type TableProps,
  Tag,
} from 'antd'
import AddUser from './AddUser'
import {
  changStatus,
  deleteRoleUser,
  getRoleUserByPage,
  postBatchRoleUser,
  postRoleUser,
  putRoleUser,
} from '@/services/system/role/roleApi'
import type { SysUserType } from '@/services/system/role/roleModel'

/**
 * 给角色分配用户
 * @returns
 */
const RoleUserDrawer: React.FC<RoleUserDrawerProps> = ({
  open,
  roleId,
  onCancel,
}) => {
  const { modal, message } = App.useApp()

  const [loading, setLoading] = useState<boolean>(false)

  // 用户表格数据
  const [tableData, setTableData] = useState([])

  // 添加用户弹窗的打开关闭
  const [openAddUser, setOpenAddUser] = useState<{
    visible: boolean
    editRow: SysUserType | null
  }>({ visible: false, editRow: null })

  // 检索表单
  const [form] = Form.useForm()

  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<any[]>([])

  // 数据总条数
  const [total, setTotal] = useState<number>(0)

  // 第一个检索框
  const ref = useRef<InputRef>(null)

  // 分页参数
  const [pagination, setPagination] = useState<{
    pageNumber: number
    pageSize: number
  }>({
    pageNumber: 1,
    pageSize: 10,
  })

  useEffect(() => {
    if (!open) return
    // 获取当前角色已经分配的用户
    getRoleUser()
    setSelectedRows([])
  }, [open, pagination])

  /**
   * 分页查询数据
   * @param params 查询参数
   */
  const getRoleUser = () => {
    setLoading(true)
    getRoleUserByPage({
      roleId: roleId,
      page: pagination.pageNumber,
      limit: pagination.pageSize,
      ...form.getFieldsValue(),
    }).then((resp) => {
      // 设置表格数据
      setTableData(resp.list)
      // 设置数据总条数
      resp.count && setTotal(resp.count)
      ref.current?.focus()
      setLoading(false)
    })
  }

  /**
   * 定义表格的列
   */
  const columns: TableProps['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      hidden: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 80,
      align: 'center',
      hidden: true,
    },
    {
      title: '用户账号',
      dataIndex: 'username',
      width: 80,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      width: 80,
      align: 'center',
    },
    {
      title: '角色',
      key: 'roles',
      align: 'center',
      render(value) {
        return value.roles.map((item: any, index: number) => (
          <Tag color="blue" style={{ margin: '0 4px' }} key={index}>
            {item.roleName}
          </Tag>
        ))
      },
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render(value) {
        return (
          <Switch
            value={Boolean(value.status)}
            checkedChildren="正常"
            unCheckedChildren="冻结"
            onChange={(e) => switchChange(e, value)}
          />
        )
      },
    },
    {
      title: '组织结构',
      dataIndex: 'organizationName',
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_text, record) => {
        return (
          <>
            <Button type="link" size="small" onClick={() => editUser(record)}>
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(record.userId)}
            >
              移除
            </Button>
          </>
        )
      },
    },
  ]

  const switchChange = (e: boolean, row: SysUserType) => {
    changStatus({ ...row, status: Number(e) }).then(() => {
      getRoleUser()
    })
  }

  /**
   * 分页改变事件
   * @param page 页数
   * @param pageSize 每页数量
   */
  const onPageSizeChange = (page: number, pageSize: number) => {
    setPagination({
      pageNumber: page,
      pageSize: pageSize,
    })
  }

  /**
   * 表单检索
   */
  const onFinish = () => {
    getRoleUser()
  }

  /**
   * 多行选中的配置
   */
  const rowSelection: TableProps['rowSelection'] = {
    // 行选中的回调
    onChange(_selectedRowKeys) {
      setSelectedRows(_selectedRowKeys)
    },
    columnWidth: 32,
    fixed: true,
    selectedRowKeys: selRows.map((item) => item.userId),
  }

  /**
   * 打开添加用户弹窗
   */
  const addUser = () => {
    setOpenAddUser({ visible: true, editRow: null })
  }

  const editUser = (userInfo: unknown) => {
    setOpenAddUser({ visible: true, editRow: userInfo as SysUserType })
  }

  /**
   * 取消添加用户
   */
  const cancelAddUser = () => {
    setOpenAddUser({ visible: false, editRow: null })
    ref.current?.focus()
  }

  /**
   * 批量删除用户
   * @param id 用户ID
   */
  const deleteBatch = (id: string[] | string, type?: string) => {
    // 删除操作需要二次确定
    modal.confirm({
      title: `${type ? '批量' : ''}删除`,
      icon: <ExclamationCircleFilled />,
      content: `确定${type ? '批量' : ''}删除用户吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        ;(type
          ? postBatchRoleUser(id as string[])
          : deleteRoleUser(id as string)
        ).then(() => {
          // 刷新表格数据
          getRoleUser()
          // 清空选择项
          setSelectedRows([])
        })
      },
    })
  }

  const handleOk = async (form: SysUserType) => {
    try {
      if (!form.userId) {
        // 新增数据
        await postRoleUser(form)
      } else {
        // 编辑数据
        await putRoleUser(form)
      }
      message.success(!form.userId ? '添加成功' : '修改成功')
      cancelAddUser()
      getRoleUser()
    } catch (error) {}
  }

  return (
    <>
      <Drawer
        title="分配用户"
        width={920}
        open={open}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        classNames={{ footer: 'text-right', body: 'flex flex-col' }}
      >
        <Card>
          <Form form={form} onFinish={onFinish}>
            <Row gutter={12}>
              <Col span={6}>
                <Form.Item
                  className="mb-0"
                  name="username"
                  label="用户账号"
                  colon={false}
                >
                  <Input autoFocus allowClear autoComplete="off" ref={ref} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  className="mb-0"
                  name="nickname"
                  label="用户姓名"
                  colon={false}
                >
                  <Input allowClear autoComplete="off" />
                </Form.Item>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    检索
                  </Button>
                  <Button
                    type="default"
                    icon={<RedoOutlined />}
                    onClick={() => {
                      form.resetFields(), getRoleUser()
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          className="mt-2 flex-1 min-h-0"
          styles={{ body: { height: '100%' } }}
        >
          <Space>
            <Button type="primary" onClick={addUser} icon={<PlusOutlined />}>
              添加用户
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={selRows.length === 0}
              onClick={() => deleteBatch(selRows, 'batch')}
            >
              批量删除
            </Button>
          </Space>
          {/* 表格数据 */}
          <Table
            className="mt-2"
            size="small"
            columns={columns}
            dataSource={tableData}
            bordered
            loading={loading}
            rowKey="userId"
            pagination={{
              pageSize: pagination.pageSize,
              current: pagination.pageNumber,
              showQuickJumper: true,
              hideOnSinglePage: false,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条`,
              total: total,
              onChange(page, pageSize) {
                onPageSizeChange(page, pageSize)
              },
            }}
            scroll={{ x: 'max-content' }}
            rowSelection={{ ...rowSelection }}
          />
        </Card>
      </Drawer>
      {/* 添加用户弹窗 */}
      <AddUser
        roleId={roleId}
        open={openAddUser}
        onCancel={cancelAddUser}
        onOk={handleOk}
      />
    </>
  )
}

export default RoleUserDrawer

export interface RoleUserDrawerProps {
  open: boolean
  // 角色id
  roleId: string
  // 点击取消的回调
  onCancel: (e: any) => void
}
