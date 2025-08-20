import type React from 'react'
import { useState } from 'react'
import useParentSize from '@/hooks/useParentSize'

import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TableProps,
  TablePaginationConfig,
} from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'
import {
  getOrganizationListByPage,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  deleteBatchOrganization,
} from '@/services/system/organization/organization'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import AddOrganization from './AddOrganization'
import { filterKeys } from '@/utils/tool'
import type {
  SysOrganizationParams,
  SysOrganizationType,
} from '@/services/system/organization/organizationModel'
import { SelectOrganizationOptions } from './config'

/**
 * 系统角色维护
 * @returns
 */
const Organization: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<string[]>([])

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SysOrganizationParams>({
      page: 1,
      limit: 10,
      organizationName: null,
    })

  // 表格的列配置
  const columns: TableProps['columns'] = [
    {
      title: '机构名称',
      dataIndex: 'organizationName',
      key: 'organizationName',
      align: 'center',
    },
    {
      title: '机构全称',
      dataIndex: 'organizationFullName',
      key: 'organizationFullName',
      align: 'center',
      width: 150,
    },
    {
      title: '机构代码',
      dataIndex: 'organizationCode',
      key: 'organizationCode',
      align: 'center',
    },
    {
      title: '机构类型',
      dataIndex: 'organizationType',
      key: 'organizationType',
      align: 'center',
    },
    {
      title: '机构类型名称',
      dataIndex: 'organizationTypeName',
      key: 'organizationTypeName',
      align: 'center',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
    },
    {
      title: '操作',
      width: '14%',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render(_, record) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({ visible: true, currentRow: record, view: true })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteDic(record.organizationId)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const onUpdateSearch = (info?: SysOrganizationType | unknown) => {
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
   * @param roleData 租户数据
   */
  const onEditOk = async (OrganizationData: SysOrganizationType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addOrganization(OrganizationData)
      } else {
        // 编辑数据
        await updateOrganization(OrganizationData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const deleteDic = (id: string[] | string, type?: string) => {
    // 删除操作需要二次确定
    modal.confirm({
      title: `${type ? '批量' : ''}删除组织机构`,
      icon: <ExclamationCircleFilled />,
      content: `确定${
        type ? '批量' : ''
      }删除组织机构吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        ;(type
          ? deleteBatchOrganization(id as string[])
          : deleteOrganization(id as string)
        ).then(() => {
          // 刷新表格数据
          onUpdateSearch({ ...searchDefaultForm })
          // 清空选择项
          setSelectedRows([])
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
            columns={SelectOrganizationOptions}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={true}
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({ visible: true, currentRow: null, view: false })
            }
          >
            新增
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            disabled={selRows.length === 0}
            onClick={() => deleteDic(selRows, 'batch')}
          >
            批量删除
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          totalKey="count"
          fetchResultKey="list"
          isPagination={true}
          rowKey="organizationId"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getOrganizationListByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
        />
      </Card>
      <AddOrganization
        params={params}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
        onOk={onEditOk}
      />
    </>
  )
}
export default Organization
