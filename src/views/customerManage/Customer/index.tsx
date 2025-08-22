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
import { SearchForm, SearchTable } from 'customer-search-form-table'
import useParentSize from '@/hooks/useParentSize'
import { filterKeys } from '@/utils/tool'
import { CustomerSearchColumns } from '../config'
import {
  addCustomer,
  deleteCustomer,
  getCustomerByPage,
  updateCustomer,
} from '@/services/customerManage/Customer/CustomerApi'
import AddCustomer from './AddCustomer'
import CustomerRecord from './CustomerRecord'
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'

const Customer: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: CustomerType | null
  }>({
    visible: false,
    currentRow: null,
  })

  const [customerDrawer, setCustomerDrawer] = useState<{
    visible: boolean
    id: string
  }>({
    visible: false,
    id: '',
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '客户',
      key: 'name',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setCustomerDrawer({ visible: true, id: value.id })}
          >
            {value.name}
          </div>
        )
      },
    },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      width: 200,
    },
    {
      title: '关联单位',
      key: 'companyName',
      dataIndex: 'companyName',
      align: 'center',
      width: 200,
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render(value) {
        return <div>{value.status ? '有效' : '无效'}</div>
      },
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
              onClick={() =>
                setParams({
                  visible: true,
                  currentRow: _,
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
      title: '删除该客户',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该客户吗？数据删除后将无法恢复！',
      onOk() {
        deleteCustomer(id).then(() => {
          message.success('删除成功')
          // 刷新表格数据
          onUpdateSearch(searchDefaultForm)
        })
      },
    })
  }

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => value !== undefined || value !== null
      )
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const onEditOk = async (customerRow: CustomerType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addCustomer(customerRow)
      } else {
        // 编辑数据
        await updateCustomer(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null })
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
            columns={CustomerSearchColumns}
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
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增客户
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
          fetchData={getCustomerByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddCustomer
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
      <CustomerRecord
        params={customerDrawer}
        onCancel={() => setCustomerDrawer({ visible: false, id: '' })}
      />
    </>
  )
}

export default Customer
