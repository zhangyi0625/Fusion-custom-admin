import { useState } from 'react'
import useParentSize from '@/hooks/useParentSize'
import { changStatus } from '@/services/system/role/roleApi'
import { SysRoleParams, SysUserType } from '@/services/system/role/roleModel'
import {
  addUserList,
  deletebatchUserList,
  deleteUserList,
  editUserList,
  getUserListByPage,
} from '@/services/system/user/userApi'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Switch,
  Tag,
  type TableProps,
  TablePaginationConfig,
} from 'antd'
import modal from 'antd/es/modal'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import AddUser from '../Role/AddUser'
import { filterKeys } from '@/utils/tool'
import { SelectUserOptions } from './config'

/**
 * 系统用户维护
 * @returns
 */
const User: React.FC = () => {
  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<string[]>([])

  // 容器高度计算（表格）
  const { parentRef, height } = useParentSize()

  const [params, setParams] = useState<{
    visible: boolean
    editRow: SysUserType | null
  }>({
    visible: false,
    editRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState<SysRoleParams>({
    page: 1,
    limit: 10,
  })

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
            value={Boolean(!value.status)}
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
      width: 120,
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
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => setParams({ visible: true, editRow: _ })}
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.userId)}
              color="danger"
              variant="link"
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const switchChange = (e: boolean, row: SysUserType) => {
    changStatus({ ...row, status: Number(e) }).then(() => {
      onUpdateSearch(searchDefaultForm)
    })
  }

  const onUpdateSearch = (info?: SysRoleParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }

  /**
   * 点击确定的回调
   * @param roleData 角色数据
   */
  const onEditOk = async (roleData: SysUserType) => {
    try {
      if (params.editRow == null) {
        // 新增数据
        await addUserList(roleData)
      } else {
        // 编辑数据
        await editUserList(roleData)
      }
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editRow: null })
      onUpdateSearch()
    } catch (error) {}
  }

  const batchDeleteRole = () => {
    modal.confirm({
      title: '批量删除用户',
      icon: <ExclamationCircleFilled />,
      content: '确定批量删除该用户吗？数据删除后将无法恢复！',
      onOk() {
        deletebatchUserList(selRows).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除用户',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该用户吗？数据删除后将无法恢复！',
      onOk() {
        deleteUserList(id).then(() => {
          // 刷新表格数据
          onUpdateSearch(searchDefaultForm)
        })
      },
    })
  }

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card>
          <SearchForm
            columns={SelectUserOptions}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      {/* 查询表格 */}
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        {/* 操作按钮 */}
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, editRow: null })}
          >
            新增
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            disabled={selRows.length === 0}
            onClick={batchDeleteRole}
          >
            批量删除
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          style={{ marginTop: '8px' }}
          bordered
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="userId"
          totalKey="count"
          fetchResultKey="list"
          isPagination={true}
          fetchData={getUserListByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
        />
      </Card>
      <AddUser
        roleId={null}
        open={params}
        onCancel={() => setParams({ visible: false, editRow: null })}
        onOk={onEditOk}
      />
    </>
  )
}
export default User
