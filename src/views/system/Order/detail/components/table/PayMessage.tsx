import { RootState } from '@/stores/store'
import { memo, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, TableProps } from 'antd'
import { filterKeys } from '@/utils/tool'
import { OrderStatusOptions } from '../../../config'

interface PayMessageProps {
  orderInfo: any
}

const PayMessage: React.FC<PayMessageProps> = memo(({ orderInfo }) => {
  const [tableData, setTableData] = useState([])

  const publicData = useSelector(
    (state: RootState) => state.publicSetting.publicData
  )

  const { paymentWay, fundRechargeStatus } = publicData

  const { refundStatus } = OrderStatusOptions

  const keys = [
    'id',
    'orderNo',
    'totalAmount',
    'couponAmount',
    'payType',
    'payTime',
    'payStatus',
    'refundTime',
    'payAmount',
    'refundStatus',
    'refundNote',
  ]

  const columns: TableProps['columns'] = [
    {
      title: '总服务费(元)',
      key: 'totalAmount',
      align: 'center',
      render(text) {
        return getAmount(text.totalAmount)
      },
    },
    {
      title: '优惠金额(元)',
      key: 'couponAmount',
      align: 'center',
      render(text) {
        return getAmount(text.couponAmount)
      },
    },
    {
      title: '支付金额(元)',
      key: 'payAmount',
      align: 'center',
      render(text) {
        return getAmount(text.payAmount)
      },
    },
    {
      title: '支付状态',
      key: 'payStatus',
      align: 'center',
      render(text) {
        return paymentWay[text.payStatus]
      },
    },
    {
      title: '付款类型',
      key: 'payType',
      align: 'center',
      render(text) {
        return fundRechargeStatus[text.payType]
      },
    },
    {
      dataIndex: 'payTime',
      title: '支付时间',
      key: 'payTime',
      align: 'center',
    },
    {
      title: '退款状态',
      key: 'refundStatus',
      align: 'center',
      render(text) {
        return refundStatus[text.refundStatus]
      },
    },
    {
      title: '退款时间',
      key: 'refundTime',
      align: 'center',
    },
    {
      dataIndex: 'refundNote',
      title: '退款描述',
      key: 'refundNote',
      align: 'center',
    },
  ]
  useEffect(() => {
    const filteredObj = filterKeys(orderInfo, keys, true)
    setTableData([filteredObj] as any)
  }, [])

  const getAmount = useCallback((value: string) => {
    return (Number(value) / 100).toFixed(2)
  }, [])

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={'id'}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  )
})

export default PayMessage
