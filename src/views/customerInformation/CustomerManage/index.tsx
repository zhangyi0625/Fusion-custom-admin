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
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import type {
  CustomerManageParams,
  CustomerManageType,
} from '@/services/essential/customerManage/customerManageModel'
import {
  addCustomerManage,
  putCustomerManage,
  deleteCustomerManage,
  getCustomerManageListByPage,
} from '@/services/essential/customerManage/customerManageApi'
import { SelectCustomerManageOptions } from './config'
import AddCustomerManage from './AddCustomerManage'
import { filterKeys } from '@/utils/tool'
import useParentSize from '@/hooks/useParentSize'

const CustomerManage: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CustomerManageParams>({
      page: 1,
      limit: 10,
      name: null,
    })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const columns: TableProps['columns'] = [
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '客户简称',
      dataIndex: 'shortName',
      key: 'shortName',
      align: 'center',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'socialCode',
      key: 'socialCode',
      width: 300,
      align: 'center',
    },
    {
      title: '修改时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
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
              onClick={() =>
                setParams({ visible: true, currentRow: record, view: true })
              }
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(record.id)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const onEditOk = async (customerRow: CustomerManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addCustomerManage(customerRow)
      } else {
        // 编辑数据
        await putCustomerManage(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除客户',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该客户吗？数据删除后将无法恢复！',
      onOk() {
        deleteCustomerManage(id).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const onUpdateSearch = (info?: CustomerManageParams | unknown) => {
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
            columns={SelectCustomerManageOptions}
            gutterWidth={24}
            labelPosition="left"
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
              setParams({ visible: true, currentRow: null, view: true })
            }
          >
            新增客户
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getCustomerManageListByPage}
          isCache="customerData"
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddCustomerManage
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default CustomerManage
