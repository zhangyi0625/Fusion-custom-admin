import '../index.scss'
import { useState } from 'react'
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
import { BusinessEnquirySearchColumns } from '../config'
import useParentSize from '@/hooks/useParentSize'
import {
  addBusinessEnquiryList,
  deleteBusinessEnquiryList,
  getBusinessEnquiryListPage,
  updateBusinessEnquiryList,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import type { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import AddBusinessEnquiry from './AddBusinessEnquiry'
import BusinessEnquiryDrawer from './BusinessEnquiryDrawer'
import { filterKeys } from '@/utils/tool'

const statusOptions = [
  {
    text: '全部',
    value: null,
  },
  {
    text: '带采购',
    value: '1',
  },
  {
    text: '已报价',
    value: '2',
  },
  // {
  //   text: '已确认',
  //   value: '3',
  // },
  // {
  //   text: '已签合同',
  //   value: '4',
  // },
  // {
  //   text: '结束',
  //   value: '5',
  // },
  // {
  //   text: '终止',
  //   value: '6',
  // },
]

const BusinessEnquiry: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [status, setStatus] = useState<string | null>(null)

  const [immediate, setImmediate] = useState<boolean>(false)

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

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
  }>({
    drawerShow: false,
    detailId: null,
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
      dataIndex: 'status',
      align: 'center',
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
      width: '10%',
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
            <Dropdown menu={{ items: more(_) }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  更多
                  <DownOutlined />
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
        // 编辑选中的行数据
        setParams({ visible: true, currentRow: row })
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
              onUpdateSearch()
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
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const changeStatus = (value: string | null) => {
    setStatus(value)
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
      setParams({ visible: false, currentRow: null })
      onUpdateSearch()
    } catch (error) {}
  }

  const jumpDetail = (no: string) => {
    setDrawer({ drawerShow: true, detailId: no })
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
            {statusOptions.map((item) => (
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
        <Space className="mb-[8px] float-right">
          <Button
            type="primary"
            style={{ zIndex: 99 }}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            创建项目
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="total"
          fetchResultKey="data"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 208 }}
          fetchData={getBusinessEnquiryListPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddBusinessEnquiry
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
      <BusinessEnquiryDrawer
        drawer={drawer}
        onCancel={() => setDrawer({ drawerShow: false, detailId: null })}
      />
    </>
  )
}

export default BusinessEnquiry
