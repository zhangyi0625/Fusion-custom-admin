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
import {
  BusinessEnquirySearchColumns,
  PurchaseBargainStatusOptions,
} from '../config'
import useParentSize from '@/hooks/useParentSize'
import { filterKeys } from '@/utils/tool'
import type { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import BusinessEnquiryDrawer from '../BusinessEnquiry/BusinessEnquiryDrawer'
import {
  addSaleProjectList,
  updateSaleProjectList,
} from '@/services/projectManage/SaleProject/SaleProjectApi'

const PurchaseBargain: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { message } = App.useApp()

  const [immediate, setImmediate] = useState<boolean>(false)

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [status, setStatus] = useState<string | null>(null)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: BusinessEnquiryType | null
  }>({
    visible: false,
    currentRow: null,
  })

  const [drawer, setDrawer] = useState<{
    drawerShow: boolean
    detailId: string | null
    source: 'PurchaseBargain'
  }>({
    drawerShow: false,
    detailId: null,
    source: 'PurchaseBargain',
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '项目编号',
      key: 'projectNo',
      align: 'center',
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => jumpDetail(value.projectNo)}
          >
            {value.projectNo}
          </div>
        )
      },
    },
    {
      title: '项目名称',
      key: 'projectName',
      dataIndex: 'projectName',
      align: 'center',
      width: 200,
    },
    {
      title: '客户',
      key: 'customer',
      dataIndex: 'customer',
      align: 'center',
    },
    {
      title: '业务员',
      key: 'payer',
      dataIndex: 'payer',
      align: 'center',
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
                ${value.status === '待议价' ? 'bg-gray-500' : 'bg-green-500'}
                  `}
            ></div>
            <p className="ml-[8px]">{value.status}</p>
          </div>
        )
      },
      width: 150,
    },
    {
      title: '询价供应商',
      key: 'salesman',
      dataIndex: 'salesman',
      align: 'center',
      width: 150,
    },
    {
      title: '预计采购日期',
      key: 'expectedDate',
      dataIndex: 'expectedDate',
      align: 'center',
      width: 180,
    },
    {
      title: '项目类型',
      key: 'projectType',
      dataIndex: 'projectType',
      align: 'center',
    },
    {
      title: '金额',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '付款方式',
      key: 'payType',
      dataIndex: 'payType',
      align: 'center',
    },
    {
      title: '创建时间',
      key: 'created',
      dataIndex: 'created',
      align: 'center',
    },
    {
      title: '创建者',
      key: 'createdr',
      dataIndex: 'creater',
      align: 'center',
    },
    {
      title: '操作',
      width: '6%',
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

  const jumpDetail = (no: string) => {
    setDrawer({ drawerShow: true, detailId: no, source: 'PurchaseBargain' })
  }

  const changeStatus = (value: string | null) => {
    setStatus(value)
  }

  const onEditOk = async (customerRow: BusinessEnquiryType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addSaleProjectList(customerRow)
      } else {
        // 编辑数据
        await updateSaleProjectList(customerRow)
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BusinessEnquirySearchColumns}
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
            {PurchaseBargainStatusOptions.map((item) => (
              <Button
                key={item.value}
                className="ml-[8px]"
                size="middle"
                type={status === item.value ? 'primary' : 'default'}
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
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="total"
          fetchResultKey="data"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getBusinessEnquiryListPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      {/* <AddBusinessEnquiry
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      /> */}
      <BusinessEnquiryDrawer
        drawer={drawer}
        onCancel={() =>
          setDrawer({
            drawerShow: false,
            detailId: null,
            source: 'PurchaseBargain',
          })
        }
      />
    </>
  )
}

export default PurchaseBargain
