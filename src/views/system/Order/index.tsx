import { useEffect, useState } from 'react'
import type React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Card, ConfigProvider, type TableProps, Space } from 'antd'
import { TablePaginationConfig } from 'antd/lib'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { SelectOrderOptions } from './config'
import { RootState, setPublicData } from '@/stores/store'
import { getOrderOptions } from '@/services/order'
import { getPublicData, getPublicSetting } from '@/services/setting'
import type { OrderSearchParams } from '@/services/order/type'
import { formatTime } from '@/utils/format'

const Order: React.FC = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getPublicData(), getPublicSetting()]).then((res) => {
      dispatch(setPublicData(res))
    })
  }, [])

  const publicData = useSelector(
    (state: RootState) => state.publicSetting.publicData
  )

  const [searchDefaultForm, setSearchDefault] = useState<OrderSearchParams>({
    pageIndex: 1,
    pageSize: 10,
    filter: {
      genres: 'PREBOOKING,BOOKING',
    },
  })

  const OrderColumns: TableProps['columns'] = [
    {
      dataIndex: 'orderNo',
      title: '订单号',
      key: 'orderNo',
      align: 'center',
    },
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      key: 'affiliateName',
      align: 'center',
    },
    {
      dataIndex: 'customerName',
      title: '用户名',
      key: 'customerName',
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'phone',
      title: '手机号',
      key: 'phone',
      align: 'center',
    },
    {
      dataIndex: 'type',
      title: '订单分类',
      key: 'type',
      align: 'center',
      width: 100,
      render(text) {
        return publicData['serviceType'][text]
      },
    },
    {
      dataIndex: 'productChannel',
      title: '舱位分类',
      key: 'productChannel',
      align: 'center',
      width: 100,
      render(text) {
        return publicData['productChannel'][text]
      },
    },
    {
      dataIndex: 'status',
      title: '订单状态',
      key: 'status',
      align: 'center',
      width: 100,
      render(text, record) {
        return (
          <div>
            <p>{publicData['frtOrderStatus'][text]}</p>
            <p>
              {text === 'CLOSURE' ? (
                <span
                  style={{
                    color:
                      record.refundStatus && record.refundStatus === 'SUCCESS'
                        ? 'yellowgreen'
                        : 'brown',
                  }}
                >
                  {!record.refundStatus
                    ? ''
                    : record.refundStatus === 'SUCCESS'
                    ? '退款成功'
                    : '退款失败'}
                </span>
              ) : null}
            </p>
          </div>
        )
      },
    },
    {
      dataIndex: 'cancelStatus',
      title: '取消状态',
      key: 'cancelStatus',
      align: 'center',
      width: 100,
      render(text) {
        return publicData['frtOrderCancel'][text]
      },
    },
    {
      dataIndex: 'por',
      title: '起运港名称',
      key: 'por',
      align: 'center',
      width: 200,
      render(text) {
        return (
          <div>
            <p>{text.localName ?? '-'}</p>
            <p>{text.name ?? '-'}</p>
          </div>
        )
      },
    },
    {
      dataIndex: 'fnd',
      title: '目的港名称',
      key: 'fnd',
      align: 'center',
      width: 200,
      render(text) {
        return (
          <div>
            <p>{text.localName ?? '-'}</p>
            <p>{text.name ?? '-'}</p>
          </div>
        )
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.createTime, 'Y-M-D h:m')}</div>
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <Space size={0}>
            <Button
              size="middle"
              onClick={() => navigate(`/system/order/${record.id}`)}
            >
              查看
            </Button>
          </Space>
        )
      },
    },
  ]

  const onUpdateSearch = (
    info: Pick<OrderSearchParams, 'filter'> | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    setSearchDefault({
      ...searchDefaultForm,
      filter: {
        ...filteredObj,
        genres: 'PREBOOKING,BOOKING',
      },
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefault({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  return (
    <>
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
            columns={SelectOrderOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card>
        <SearchTable
          columns={OrderColumns}
          rowKey="id"
          fetchData={getOrderOptions}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  )
}

export default Order
