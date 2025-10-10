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
import { SearchForm, SearchTable } from 'customer-search-form-table'
import { SupplierAuditSearchColumns } from '../config'
import useParentSize from '@/hooks/useParentSize'
import { filterKeys } from '@/utils/tool'
import type { SupplierType } from '@/services/supplierManage/Supplier/SupplierModel'
import {
  addSupplier,
  getSupplierByPage,
  updateSupplier,
} from '@/services/supplierManage/Supplier/SupplierApi'
import AddSupplier from '../Supplier/AddSupplier'

const SupplierAudit: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
    sort: 'create_time desc',
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SupplierType | null
    editPassword: boolean
  }>({
    visible: false,
    currentRow: null,
    editPassword: false,
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '供应商',
      key: 'name',
      align: 'center',
      width: 150,
      render(value) {
        return <div className="text-blue-500 cursor-pointer">{value.name}</div>
      },
    },
    {
      title: '社会统一信用代码',
      key: 'code',
      dataIndex: 'code',
      align: 'center',
      width: 200,
    },
    {
      title: '手机号',
      key: 'contactPhone',
      dataIndex: 'contactPhone',
      align: 'center',
      width: 100,
    },
    {
      title: '审核状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
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
                  editPassword: false,
                })
              }
              type="link"
            >
              通过
            </Button>
            <Button
              // onClick={() => deleteItem(_.id)}
              color="danger"
              variant="link"
            >
              拒绝
            </Button>
          </Space>
        )
      },
    },
  ]

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

  const onEditOk = async (customerRow: SupplierType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addSupplier(customerRow)
      } else {
        // 编辑数据
        await updateSupplier(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, editPassword: false })
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={SupplierAuditSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            defaultColsNumber={2}
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
              setParams({
                visible: true,
                currentRow: null,
                editPassword: false,
              })
            }
          >
            新增供应商
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          pageIndexKey="page"
          pageSizeKey="limit"
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getSupplierByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddSupplier
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, editPassword: false })
        }
      />
    </>
  )
}

export default SupplierAudit
