import '../index.scss'
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
import useParentSize from '@/hooks/useParentSize'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import { OpenEnquirySearchColumns, ProjectStatusOptions } from '../config'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import OpenEnquiryAudit from './OpenEnquiryAudit'
import OpenEnquiryDetail from './OpenEnquiryDetail'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import { BusinessEnquiryParams } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

const OpenEnquiry: React.FC = () => {
  const { parentRef, height } = useParentSize()

  // const { modal, message } = App.useApp()

  const [immediate, setImmediate] = useState<boolean>(false)

  const [searchColumns, setSearchColumns] = useState(OpenEnquirySearchColumns)

  const [drawer, setDrawer] = useState<{
    drawerShow: boolean
    detailId: string | null
  }>({
    drawerShow: false,
    detailId: null,
  })

  const [auidtDrawer, setAuditDrawer] = useState<{
    visible: boolean
    currentRow: null
  }>({
    visible: false,
    currentRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<BusinessEnquiryParams>({
      page: 1,
      limit: 10,
      keyword: null,
      customerKeyword: null,
      isInquiry: false,
      status: null,
      sort: 'create_time desc',
    })

  const tableColumns: TableProps['columns'] = [
    {
      title: '询价标题',
      key: 'title',
      align: 'center',
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setDrawer({ drawerShow: true, detailId: value.id })}
          >
            {value.number}
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
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      width: 120,
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
      title: '报价数',
      key: 'supplierCount',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.supplierCount}</div>
      },
    },
    {
      title: '浏览量',
      key: 'count',
      dataIndex: 'count',
      align: 'center',
      width: 100,
    },
    {
      title: '报价金额',
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.price}万元</div>
      },
    },
    {
      title: '城市/区县',
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.price}万元</div>
      },
    },
    {
      title: '报价截止日期',
      key: 'estimatedPurchaseTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.estimatedPurchaseTime, 'Y-M-D')}</div>
      },
    },
    {
      title: '询价创建日期',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '简要说明',
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
              onClick={() => setAuditDrawer({ visible: true, currentRow: _ })}
              type="link"
            >
              审核
            </Button>
            <Button
              // onClick={() =>
              //   _.status === 'PENDING_PURCHASE'
              //     ? deleteSaleProject(_.id)
              //     : stopSaleProject(_)
              // }
              disabled={
                ProjectStatusOptions.findIndex(
                  (item) => item.text === _.status
                ) > 4
              }
              color="danger"
              variant="link"
            >
              取消
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
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'isInquiry', 'status'],
      true
    )
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const changeStatus = (value: string | null) => {
    setSearchDefaultForm({ ...searchDefaultForm, status: value })
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
            columns={OpenEnquirySearchColumns}
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
            isShowExpend={false}
            iconHidden={true}
            searchBtnText="查询"
            onUpdateSearch={onUpdateSearch}
          />
          <div className="flex items-center">
            <p className="text-gray-900">项目状态：</p>
            {ProjectStatusOptions.map((item) => (
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
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 178 }}
          fetchData={getBusinessEnquiryListPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <OpenEnquiryAudit
        params={auidtDrawer}
        onCancel={() => setAuditDrawer({ visible: false, currentRow: null })}
      />
      <OpenEnquiryDetail
        params={drawer}
        onCancel={() => setDrawer({ drawerShow: false, detailId: null })}
      />
    </>
  )
}

export default OpenEnquiry
