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
import { OpenEnquirySearchColumns, OpenEnquiryStatusOptions } from '../config'
import OpenEnquiryAudit from './OpenEnquiryAudit'
import OpenEnquiryDetail from './OpenEnquiryDetail'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import {
  getOpenEnquiryListPage,
  postAllocationEnquiry,
  postAuidtEnquiry,
} from '@/services/projectManage/OpenEnquiry/OpenEnquiryApi'
import {
  OpenEnquiryParams,
  OpenEnquiryType,
} from '@/services/projectManage/OpenEnquiry/OpenEnquiryModel'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { ProductManageType } from '@/services/productManage/productManageModel'

const OpenEnquiry: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

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
    currentRow: OpenEnquiryType | null
  }>({
    visible: false,
    currentRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState<OpenEnquiryParams>(
    {
      page: 1,
      limit: 10,
      keyword: null,
      title: '',
      status: null,
      sort: 'create_time desc',
    }
  )

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
            {value.title}
          </div>
        )
      },
      width: 150,
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
      key: 'customerPhone',
      dataIndex: 'customerPhone',
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
                      value.status === 'PENDING_REVIEW'
                        ? 'bg-gray-500'
                        : value.status === 'ENDED'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }
                      `}
            ></div>
            <p className="ml-[8px]">
              {
                OpenEnquiryStatusOptions.find(
                  (item) => item.value === value.status
                )?.label
              }
            </p>
          </div>
        )
      },
      width: 150,
    },
    {
      title: '报价数',
      key: 'quotationCount',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.quotationCount}</div>
      },
    },
    {
      title: '浏览量',
      key: 'viewCount',
      dataIndex: 'viewCount',
      align: 'center',
      width: 100,
    },
    {
      title: '报价金额',
      key: 'estimatedAmount',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.estimatedAmount}</div>
      },
    },
    {
      title: '交货地区',
      key: 'address',
      dataIndex: 'address',
      align: 'center',
      width: 220,
    },
    {
      title: '报价截止日期',
      key: 'deadline',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.deadline, 'Y-M-D')}</div>
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
      key: 'remark',
      dataIndex: 'remark',
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
            {_.status === 'PENDING_REVIEW' ? (
              <Button
                onClick={() => setAuditDrawer({ visible: true, currentRow: _ })}
                type="link"
              >
                审核
              </Button>
            ) : (
              <Button
                onClick={() => cancelEnquiry(_.id)}
                disabled={
                  OpenEnquiryStatusOptions.findIndex(
                    (item) => item.value === _.status
                  ) > 4
                }
                color="danger"
                variant="link"
              >
                取消
              </Button>
            )}
          </Space>
        )
      },
    },
  ]

  const cancelEnquiry = async (id: string) => {
    modal.confirm({
      title: '取消询价',
      icon: <ExclamationCircleFilled />,
      content: '确定取消该询价吗？询价取消后将无法恢复！',
      onOk() {
        postAuidtEnquiry({ cause: null, id: id, status: 'CANCELLED' }).then(
          () => {
            // 刷新表格数据
            onUpdateSearch(searchDefaultForm)
          }
        )
      },
    })
  }

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'status'],
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

  const onAuditEnquiry = (
    status: string,
    rejectReason?: string,
    params?: ProductManageType[] | null
  ) => {
    if (params?.length) {
      postAllocationEnquiry(
        auidtDrawer.currentRow?.id as string,
        params as ProductManageType[]
      ).then(() => {
        loadEnquiryResult(status, rejectReason)
      })
    } else {
      loadEnquiryResult(status, rejectReason)
    }
  }

  const loadEnquiryResult = (status: string, rejectReason?: string) => {
    postAuidtEnquiry({
      id: auidtDrawer.currentRow?.id as string,
      status: status,
      cause: rejectReason as string,
    }).then(() => {
      message.success(rejectReason ? '拒绝审核' : '审核成功')
      setSearchDefaultForm({ ...searchDefaultForm })
      setAuditDrawer({ visible: false, currentRow: null })
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
            {OpenEnquiryStatusOptions.map((item) => (
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
                {item.label}
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
          scroll={{ x: 'max-content', y: height - 138 }}
          rowClassName={(_, index) => (index % 2 === 1 ? 'even' : 'odd')}
          fetchData={getOpenEnquiryListPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <OpenEnquiryAudit
        params={auidtDrawer}
        onCancel={() => setAuditDrawer({ visible: false, currentRow: null })}
        onAuditEnquiry={onAuditEnquiry}
      />
      <OpenEnquiryDetail
        params={drawer}
        onCancel={() => setDrawer({ drawerShow: false, detailId: null })}
      />
    </>
  )
}

export default OpenEnquiry
