import { useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import useParentSize from '@/hooks/useParentSize'
import {
  addContracting,
  deleteContracting,
  getContractingByPage,
  updateContracting,
} from '@/services/system/contractingUnits/ContractingUnits'
import AddContractingUnits from './AddContractingUnits'
import { SearchTable } from 'customer-search-form-table'
import { filterKeys } from '@/utils/tool'

const ContractingUnits: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: { name: string } | null
  }>({
    visible: false,
    currentRow: null,
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '签约单位',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '创建人',
      key: 'createName',
      dataIndex: 'createName',
      align: 'center',
    },
    {
      title: '创建日期',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              onClick={() => setParams({ visible: true, currentRow: _ })}
              type="link"
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
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

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除签约单位',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该签约单位吗？数据删除后将无法恢复！',
      onOk() {
        deleteContracting(id).then(() => {
          message.success('删除成功')
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const onEditOk = async (customerRow: { name: string }) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addContracting(customerRow)
      } else {
        // 编辑数据
        await updateContracting(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null })
      onUpdateSearch()
    } catch (error) {}
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider></ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px] float-right">
          <Button
            type="primary"
            style={{ zIndex: 99 }}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增单位
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          scroll={{ x: 'max-content', y: height - 208 }}
          fetchData={getContractingByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddContractingUnits
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  )
}

export default ContractingUnits
