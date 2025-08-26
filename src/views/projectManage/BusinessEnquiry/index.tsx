import '../index.scss'
import { useEffect, useState } from 'react'
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
  Tooltip,
} from 'antd'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import { BusinessEnquirySearchColumns, ProjectStatusOptions } from '../config'
import useParentSize from '@/hooks/useParentSize'
import {
  addBusinessEnquiryList,
  deleteBusinessEnquiryList,
  getBusinessEnquiryListPage,
  updateBusinessEnquiryList,
  upgradeBusinessEnquiry,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import type {
  BusinessEnquiryParams,
  BusinessEnquiryType,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import AddBusinessEnquiry from './AddBusinessEnquiry'
import BusinessEnquiryDrawer from './BusinessEnquiryDrawer'
import { filterKeys } from '@/utils/tool'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import { getRoleUser } from '@/services/system/role/roleApi'
import { getCustomerList } from '@/services/customerManage/Customer/CustomerApi'
import { getContractingList } from '@/services/system/contractingUnits/ContractingUnits'
import { formatTime } from '@/utils/format'
import { getPayerUnit } from '@/services/customerManage/PayerUnit/PayerUnitApi'

const BusinessEnquiry: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(true)

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<BusinessEnquiryParams>({
      page: 1,
      limit: 10,
      keyword: null,
      customerKeyword: null,
      isInquiry: true,
      status: null,
    })

  const [searchColumns, setSearchColumns] = useState(
    BusinessEnquirySearchColumns
  )

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: BusinessEnquiryType | null
    source: 'BusinessEnquiry'
  }>({
    visible: false,
    source: 'BusinessEnquiry',
    currentRow: null,
  })

  const [drawer, setDrawer] = useState<{
    drawerShow: boolean
    detailId: string | null
    source: 'BusinessEnquiry'
    index?: number
  }>({
    drawerShow: false,
    detailId: null,
    source: 'BusinessEnquiry',
  })

  useEffect(() => {
    setImmediate(true)
    if (
      !essential.userData?.length ||
      !essential.customerData?.length ||
      !essential.contractingData?.length ||
      !essential.payerUnitData?.length
    ) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential])

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    Promise.all([
      getRoleUser({}),
      getCustomerList({}),
      getContractingList(),
      getPayerUnit(),
    ]).then((resp) => {
      let key = ['userData', 'customerData', 'contractingData', 'payerUnitData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let { userData, customerData } = essential
    let newData = [
      {
        name: '全部客户',
        id: '',
      },
    ].concat(customerData as ConcatArray<{ name: string; id: string }>)
    searchColumns.map((item) => {
      if (item.name === 'customerId' || item.name === 'salespersonId') {
        item.options = item.name === 'customerId' ? newData : userData
      }
    })
    setSearchColumns([...searchColumns])
    setImmediate(false)
  }

  const tableColumns: TableProps['columns'] = [
    {
      title: '项目编号',
      key: 'number',
      align: 'center',
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => jumpDetail(value.id)}
          >
            {value.number}
          </div>
        )
      },
    },
    {
      title: '项目名称',
      key: 'name',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <Tooltip
              title={
                <div className="text-stone-900 p-[10px]">
                  <p>客户付款方：{value.companyName ?? '-'}</p>
                  <p>我司签约：{value.entrustName ?? '-'}</p>
                </div>
              }
              color="white"
            >
              {value.name}
            </Tooltip>
          </div>
        )
      },
    },
    {
      title: '客户',
      key: 'customerName',
      dataIndex: 'customerName',
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
      title: '状态',
      key: 'status',
      align: 'center',
      render(value) {
        return (
          <div className="flex items-center justify-center">
            <div
              className={`w-[8px] h-[8px] rounded-lg
                ${
                  value.status === 'PENDING_PURCHASE'
                    ? 'bg-gray-500'
                    : value.status === 'TERMINATED'
                    ? 'bg-red-500'
                    : 'bg-green-500'
                }
                  `}
            ></div>
            <p className="ml-[8px]">
              {
                ProjectStatusOptions.find((item) => item.value === value.status)
                  ?.text
              }
            </p>
          </div>
        )
      },
      width: 150,
    },
    {
      title: '询价供应商',
      key: 'supplierCount',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => jumpDetail(value.id, 2)}
          >
            {value.supplierCount}
          </div>
        )
      },
    },
    {
      title: '预计采购日期',
      key: 'estimatedPurchaseTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.estimatedPurchaseTime, 'Y-M-D')}</div>
      },
    },
    {
      title: '项目类型',
      key: 'type',
      align: 'center',
      width: 120,
      render(value) {
        return (
          <div>{value.type === 'FRAME_CONTRACT' ? '框架合同' : '即期合同'}</div>
        )
      },
    },
    {
      title: '预估金额',
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.price}万元</div>
      },
    },
    {
      title: '付款方式',
      key: 'payMethod',
      dataIndex: 'payMethod',
      align: 'center',
      width: 120,
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
            <Button
              onClick={() =>
                setParams({
                  visible: true,
                  currentRow: _,
                  source: 'BusinessEnquiry',
                })
              }
              type="link"
            >
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

  const more: (row: any) => MenuProps['items'] = (row) => [
    {
      key: 'edit',
      label: <p className="text-blue-500">升级</p>,
      onClick: () => {
        upgradeBusinessEnquiry(row.id).then(() => {
          message.success('升级成功')
          onUpdateSearch(searchDefaultForm)
        })
      },
    },
    {
      key: 'delete',
      label: <p className="text-red-400">删除</p>,
      onClick: () => {
        // 删除选中的行数据
        modal.confirm({
          title: '删除商机',
          icon: <ExclamationCircleFilled />,
          content: '确定删除该商机吗？数据删除后将无法恢复！',
          onOk() {
            deleteBusinessEnquiryList(row.roleId).then(() => {
              // 刷新表格数据
              onUpdateSearch(searchDefaultForm)
            })
          },
        })
      },
    },
  ]

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'isInquiry', 'status'],
      true
    )
    console.log(pageInfo, filteredObj, info)

    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const changeStatus = (value: string | null) => {
    setSearchDefaultForm({ ...searchDefaultForm, status: value })
  }

  const onEditOk = async (customerRow: BusinessEnquiryType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addBusinessEnquiryList(customerRow)
      } else {
        // 编辑数据
        await updateBusinessEnquiryList(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, source: 'BusinessEnquiry' })
      onUpdateSearch(searchDefaultForm)
    } catch (error) {}
  }

  const jumpDetail = (no: string, index?: number) => {
    setDrawer({
      drawerShow: true,
      detailId: no,
      source: 'BusinessEnquiry',
      index: index ? 3 : undefined,
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
          <div className="flex items-center">
            <p className="text-gray-900">项目状态：</p>
            {ProjectStatusOptions.slice(0, 3).map((item) => (
              <Button
                key={item.value}
                className="ml-[8px]"
                size="middle"
                type={
                  searchDefaultForm.status === item.value
                    ? 'primary'
                    : 'default'
                }
                onClick={() => changeStatus(item.value)}
              >
                {item.text}
              </Button>
            ))}
          </div>
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
                source: 'BusinessEnquiry',
              })
            }
          >
            创建项目
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getBusinessEnquiryListPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddBusinessEnquiry
        params={params}
        onCancel={() =>
          setParams({
            visible: false,
            currentRow: null,
            source: 'BusinessEnquiry',
          })
        }
        onOk={onEditOk}
      />
      <BusinessEnquiryDrawer
        drawer={drawer}
        onCancel={() =>
          setDrawer({
            drawerShow: false,
            detailId: null,
            source: 'BusinessEnquiry',
          })
        }
      />
    </>
  )
}

export default BusinessEnquiry
