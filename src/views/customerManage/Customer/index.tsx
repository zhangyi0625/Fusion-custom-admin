import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { DownloadOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import useParentSize from '@/hooks/useParentSize'
import { filterKeys } from '@/utils/tool'
import { CustomerSearchColumns } from '../config'
import {
  addCustomer,
  deleteCustomer,
  getCustomerByPageCommon,
  updateCustomer,
  receiveCustomer,
} from '@/services/customerManage/Customer/CustomerApi'
import AddCustomer from './AddCustomer'
import CustomerRecord from './CustomerRecord'
import type {
  CustomerParams,
  CustomerType,
} from '@/services/customerManage/Customer/CustomerModel'
import { ExportTableDataByXLSX } from '@/utils/export'
import { useNavigate } from 'react-router-dom'
import { getDictionaryListByIdPage } from '@/services/system/dictionary/dictionaryApi'

const Customer: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const navigate = useNavigate()

  const { modal, message } = App.useApp()

  const [formMaps, setFormMaps] = useState(CustomerSearchColumns)

  const [searchDefaultForm, setSearchDefaultForm] = useState<CustomerParams>({
    page: 1,
    limit: 10,
    sort: 'create_time desc',
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: CustomerType | null
  }>({
    visible: false,
    currentRow: null,
  })

  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const [customerDrawer, setCustomerDrawer] = useState<{
    visible: boolean
    id: string
  }>({
    visible: false,
    id: '',
  })

  const [downLoading, setDownLoading] = useState<boolean>(false)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      let resp = await getDictionaryListByIdPage({
        dictId: '2046798065079304194',
      })
      formMaps.map((item) => {
        if (item.name === 'level') {
          item.options = resp.list.map((el: { dictDataName: string }) => ({
            label: el.dictDataName,
            value: el.dictDataName,
          }))
        }
      })
      setFormMaps([...formMaps])
    } catch {}
  }

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
      width: 150,
    },
    {
      title: '单位名称',
      key: 'companyName',
      // dataIndex: 'companyName',
      align: 'center',
      width: 250,
      render(value) {
        return (
          <div>
            {value.refCompanyName ? value.refCompanyName : value.companyName}
            {value.refCompanyName ? (
              <span
                onClick={() =>
                  navigate(
                    `/customerManage/payerUnit?companyName=${value.refCompanyName}`,
                  )
                }
                className="underline text-[#1677FF] cursor-pointer ml-[4px]"
              >
                查看
              </span>
            ) : (
              '（未关联）'
            )}
          </div>
        )
      },
    },
    {
      title: '客户级别',
      key: 'level',
      dataIndex: 'level',
      align: 'center',
      width: 100,
    },
    {
      title: '客户来源',
      key: 'source',
      dataIndex: 'source',
      align: 'center',
      width: 100,
    },
    {
      title: '项目名称',
      key: 'projectName',
      dataIndex: 'projectName',
      align: 'center',
      width: 200,
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      align: 'center',
      width: 250,
    },
    {
      title: '地址',
      key: 'address',
      dataIndex: 'address',
      align: 'center',
      width: 220,
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render(value) {
        return <div>{value.status ? '有效' : '无效'}</div>
      },
      width: 80,
    },
    {
      title: '上次登录时间',
      key: 'loginTime',
      dataIndex: 'loginTime',
      align: 'center',
      width: 200,
    },
    {
      title: '创建日期',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
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
        ([, value]) => value !== undefined || value !== null,
      ),
    )
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort'],
      true,
    )
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

  const downloadData = async () => {
    setDownLoading(true)
    try {
      const resp = await getCustomerByPageCommon({
        ...searchDefaultForm,
        page: 1,
        limit: 9999,
      })
      ExportTableDataByXLSX(
        resp.list,
        tableColumns.splice(0, tableColumns.length - 1),
        '客户管理导出列表',
      )
      setDownLoading(false)
    } catch {
      message.error('导出列表异常，请联系相关人员～')
      setDownLoading(false)
    }
  }

  const getCommonCustomer = async () => {
    if (selectedRows.length === 0) {
      message.error('请选择要领取的客户')
      return
    }
    try {
      await receiveCustomer(selectedRows)
      message.success('领取成功')
      // 刷新表格数据
      onUpdateSearch({ ...searchDefaultForm })
      setSelectedRows([])
    } catch (error) {
      // message.error('领取客户异常，请联系相关人员～')
    }
  }
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={formMaps}
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
            onClick={getCommonCustomer}
          >
            领取
          </Button>
          <Button
            type="primary"
            style={{ zIndex: 99 }}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增客户
          </Button>
          <Button
            color="blue"
            variant="outlined"
            style={{ zIndex: 99, marginLeft: '10px' }}
            loading={downLoading}
            icon={<DownloadOutlined />}
            onClick={downloadData}
          >
            导出列表
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
          rowClassName={(_, index) => (index % 2 === 1 ? 'even' : 'odd')}
          fetchData={getCustomerByPageCommon}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
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
