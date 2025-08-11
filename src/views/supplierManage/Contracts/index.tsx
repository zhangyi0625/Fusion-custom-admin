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
import AddContract from './AddContracts'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import {
  addContracts,
  deleteContracts,
  getContractsByPage,
  updateContracts,
} from '@/services/supplierManage/Contracts/ContractsApi'
import { ContractsType } from '@/services/supplierManage/Contracts/ContractsModel'
import { filterKeys } from '@/utils/tool'
import useParentSize from '@/hooks/useParentSize'
import { ContractsSearchColumns } from '../config'

const Contracts: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: ContractsType | null
    source: null
  }>({
    visible: false,
    currentRow: null,
    source: null,
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '联系人姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      width: 100,
    },
    {
      title: '关联供应商',
      key: 'supplierName',
      dataIndex: 'supplierName',
      align: 'center',
      width: 100,
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
              onClick={() =>
                setParams({
                  visible: true,
                  currentRow: _,
                  source: null,
                })
              }
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
      title: '删除该联系人',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该供应商吗？数据删除后将无法恢复！',
      onOk() {
        deleteContracts(id).then(() => {
          message.success('删除成功')
          // 刷新表格数据
          onUpdateSearch(searchDefaultForm)
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

  const onEditOk = async (customerRow: ContractsType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addContracts(customerRow)
      } else {
        // 编辑数据
        await updateContracts(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, source: null })
      onUpdateSearch(searchDefaultForm)
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={ContractsSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            showRow={2}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 0 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
              },
            }}
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            iconHidden={true}
            searchBtnText="查询"
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px] float-right">
          <Button
            type="primary"
            style={{ zIndex: 99 }}
            onClick={() =>
              setParams({ visible: true, currentRow: null, source: null })
            }
          >
            新增联系人
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getContractsByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddContract
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, source: null })
        }
      />
    </>
  )
}

export default Contracts
