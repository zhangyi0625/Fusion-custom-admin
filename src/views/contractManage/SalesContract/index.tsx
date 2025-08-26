import { useState, useEffect } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  MenuProps,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import { AddSalesContractForm, SalesContractSearchColumns } from '../config'
import useParentSize from '@/hooks/useParentSize'
import type {
  SaleContractParams,
  SaleContractType,
} from '@/services/contractManage/SalesContract/SalesContractModel'
import {
  addContractManage,
  deleteContractManage,
  getContractManageByPage,
  getContractManageDetail,
  updateContractManage,
} from '@/services/contractManage/SalesContract/SalesContractApi'
import AddSalesContract, { AddSalesContractProps } from './AddSalesContract'
import SalesContractDrawer from './SalesContractDrawer'
import ConfirmSaleContractStatus from './Component/ConfirmSaleContractStatus'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import { filterKeys } from '@/utils/tool'
import { getRoleUser } from '@/services/system/role/roleApi'
import { getCustomerList } from '@/services/customerManage/Customer/CustomerApi'
import { getPayerUnit } from '@/services/customerManage/PayerUnit/PayerUnitApi'
import { formatTime } from '@/utils/format'

const SalesContract: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(true)

  const [searchColumns, setSearchColumns] = useState(SalesContractSearchColumns)

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SaleContractParams>({
      page: 1,
      limit: 10,
      source: 'S',
    })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SaleContractType | null
    source: string
  }>({
    visible: false,
    currentRow: null,
    source: '',
  })

  const [drawer, setDrawer] = useState<{
    drawerShow: boolean
    detailId: string | null
    source: 'SalesContract'
  }>({
    drawerShow: false,
    detailId: null,
    source: 'SalesContract',
  })

  const [confirmParams, setConfirmParams] = useState<{
    visible: boolean
    currentRow: SaleContractType | null
  }>({
    visible: false,
    currentRow: null,
  })

  useEffect(() => {
    setImmediate(true)
    if (
      !essential.userData?.length ||
      !essential.customerData?.length ||
      !essential.payerUnitData?.length
    ) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential])

  const tableColumns: TableProps['columns'] = [
    {
      title: '合同编号',
      key: 'number',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() =>
              setDrawer({
                drawerShow: true,
                detailId: value.id,
                source: 'SalesContract',
              })
            }
          >
            {value.number}
          </div>
        )
      },
    },
    {
      title: '合同名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '客户',
      key: 'customerName',
      dataIndex: 'customerName',
      align: 'center',
      width: 100,
    },
    {
      title: '客户付款方',
      key: 'companyName',
      dataIndex: 'companyName',
      align: 'center',
      width: 100,
    },
    {
      title: '项目名称',
      key: 'projectName',
      dataIndex: 'projectName',
      align: 'center',
      width: 100,
    },
    {
      title: '业务员',
      key: 'salespersonName',
      dataIndex: 'salespersonName',
      align: 'center',
      width: 100,
    },
    {
      title: '合同类型',
      key: 'type',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.type === 'FRAMEWORK' ? '框架合同' : '即期合同'}</div>
      },
    },
    {
      title: '合同金额',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: 100,
    },
    {
      title: '已执行金额',
      key: 'invoicePrice',
      dataIndex: 'invoicePrice',
      align: 'center',
      width: 100,
    },
    {
      title: '已开票金额',
      key: 'receiptPrice',
      dataIndex: 'receiptPrice',
      align: 'center',
      width: 100,
    },
    {
      title: '合同日期',
      key: 'contractTime',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{formatTime(value.contractTime, 'Y-M-D')}</div>
      },
    },
    {
      title: '合同状态',
      key: 'status',
      align: 'center',
      width: 100,
      render(value) {
        let options = AddSalesContractForm.find(
          (item) => item.name === 'status'
        )?.options
        return options?.find((item) => item.value === value.status)?.label
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '创建者',
      key: 'createName',
      dataIndex: 'createName',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button onClick={() => openSalesContractDetail(_.id)} type="link">
              编辑
            </Button>
            <Dropdown menu={{ items: more(_) }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  更多
                  <DownOutlined style={{ width: '10px', height: '10px' }} />
                </Space>
              </a>
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  const openSalesContractDetail = (id: string) => {
    getContractManageDetail(id).then((resp) => {
      setParams({
        visible: true,
        currentRow: resp,
        source: '',
      })
    })
  }

  const more: (row: any) => MenuProps['items'] = (row) => [
    {
      key: 'edit',
      label: <p className="text-blue-500">更改合同状态</p>,
      onClick: () => {
        setConfirmParams({ visible: true, currentRow: row })
      },
    },
    {
      key: 'delete',
      label: <p className="text-red-400">删除</p>,
      onClick: () => {
        // 删除选中的行数据
        modal.confirm({
          title: '删除该销售合同',
          icon: <ExclamationCircleFilled />,
          content: '确定删除该销售合同吗？数据删除后将无法恢复！',
          onOk() {
            deleteContractManage(row.id).then(() => {
              message.success('删除成功')
              // 刷新表格数据
              onUpdateSearch(searchDefaultForm)
            })
          },
        })
      },
    },
  ]

  const confirmStatusModal = (row: SaleContractType) => {
    updateContractManage(row).then(() => {
      message.success('修改成功')
      setConfirmParams({ visible: false, currentRow: null })
      // 刷新表格数据
      onUpdateSearch(searchDefaultForm)
    })
  }

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    Promise.all([getRoleUser({}), getCustomerList({}), getPayerUnit()]).then(
      (resp) => {
        let key = ['userData', 'customerData', 'payerUnitData']
        key.map((_, index: number) => {
          dispatch(setEssentail({ value: resp[index], key: key[index] }))
        })
        getReduxData()
      }
    )
  }

  const getReduxData = () => {
    let { userData, customerData } = essential
    searchColumns.map((item) => {
      if (item.name === 'customerId' || item.name === 'salespersonId') {
        item.options = item.name === 'customerId' ? customerData : userData
      }
    })
    setSearchColumns([...searchColumns])
    setImmediate(false)
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

  const onEditOk = async (customerRow: SaleContractType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addContractManage(customerRow)
      } else {
        // 编辑数据
        await updateContractManage(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, source: '' })
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
            columns={searchColumns}
            gutterWidth={24}
            labelPosition="left"
            showRow={1}
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
            isShowExpend={true}
            iconHidden={true}
            searchBtnText="查询"
            advancedFilterText={['展开', '收起']}
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
              setParams({ visible: true, currentRow: null, source: '' })
            }
          >
            新建合同
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
          immediate={immediate}
          fetchData={getContractManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddSalesContract
        params={params as AddSalesContractProps['params']}
        onCancel={() =>
          setParams({
            visible: false,
            currentRow: null,
            source: 'SaleProject',
          })
        }
        contractType="SalesContract"
        onOk={onEditOk}
      />
      <SalesContractDrawer
        drawer={drawer}
        onCancel={() =>
          setDrawer({
            drawerShow: false,
            detailId: null,
            source: 'SalesContract',
          })
        }
      />
      <ConfirmSaleContractStatus
        params={confirmParams}
        onCancel={() => setConfirmParams({ visible: false, currentRow: null })}
        onOk={confirmStatusModal}
      />
    </>
  )
}

export default SalesContract
