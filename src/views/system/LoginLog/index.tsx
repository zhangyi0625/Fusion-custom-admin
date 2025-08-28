import { useState } from 'react'
import { Card, ConfigProvider, TablePaginationConfig, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import useParentSize from '@/hooks/useParentSize'
import { getLoginLog } from '@/services/setting'
import { SysRoleParams } from '@/services/system/role/roleModel'

const LoginLog: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const [searchDefaultForm, setSearchDefaultForm] = useState<SysRoleParams>({
    page: 1,
    limit: 10,
  })

  // 0登录成功, 1登录失败, 2退出登录, 3续签token
  const loginTypeOptions = [
    {
      label: '登录成功',
      value: 0,
    },
    {
      label: '登录失败',
      value: 1,
    },
    {
      label: '0退出登录',
      value: 2,
    },
    {
      label: '续签token',
      value: 3,
    },
  ]

  const columns: TableProps['columns'] = [
    {
      title: '浏览器设备',
      dataIndex: 'browser',
      width: 100,
      align: 'center',
    },
    {
      title: '用户账号',
      dataIndex: 'username',
      width: 100,
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: 100,
      align: 'center',
    },
    {
      title: '设备名',
      dataIndex: 'device',
      width: 200,
      align: 'center',
    },
    {
      title: '操作类型',
      key: 'loginType',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              loginTypeOptions.find((item) => item.value === value.loginType)
                ?.label
            }
          </div>
        )
      },
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 150,
    },
  ]

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }

  return (
    <>
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          <SearchTable
            size="middle"
            columns={columns}
            bordered
            scroll={{ x: 'max-content', y: height - 118 }}
            rowKey="id"
            totalKey="count"
            fetchResultKey="list"
            isPagination={true}
            fetchData={getLoginLog}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
    </>
  )
}

export default LoginLog
