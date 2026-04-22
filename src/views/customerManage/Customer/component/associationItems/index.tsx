import { getBusinessEnquiryList } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import { formatTime } from '@/utils/format'
import { ProjectStatusOptions } from '@/views/projectManage/config'
import { Table, TableProps, Tooltip } from 'antd'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

export type AssociationItemsRef = {
  onRefresh: () => void
}

export type AssociationItemsProps = {
  detailId: string
}

const AssociationItems = React.forwardRef<
  AssociationItemsRef,
  AssociationItemsProps
>(({ detailId }, ref) => {
  const [tableData, setTableData] = useState([])

  const { formatMessage } = useIntl()

  const navigate = useNavigate()

  useEffect(() => {
    detailId && loadAssociationItems()
  }, [detailId])

  useImperativeHandle(ref, () => ({
    onRefresh: () => loadAssociationItems(),
  }))

  const columns: TableProps['columns'] = [
    {
      title: formatMessage({ id: '项目编号' }),
      key: 'number',
      align: 'center',
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => jumpDetail(value.number)}
          >
            {value.number}
          </div>
        )
      },
    },
    {
      title: formatMessage({ id: '项目名称' }),
      key: 'name',
      align: 'center',
      width: 300,
      render(value) {
        return (
          <div>
            <Tooltip
              title={
                <div className="text-stone-900 p-[10px]">
                  <p>
                    {formatMessage({ id: '客户付款方' })}：
                    {value.companyName ?? '-'}
                  </p>
                  <p>
                    {formatMessage({ id: '我司签约' })}：
                    {value.entrustName ?? '-'}
                  </p>
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
      title: formatMessage({ id: '业务员' }),
      key: 'salespersonName',
      dataIndex: 'salespersonName',
      align: 'center',
      width: 100,
    },
    {
      title: formatMessage({ id: '状态' }),
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
      title: formatMessage({ id: '预计采购日期' }),
      key: 'estimatedPurchaseTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.estimatedPurchaseTime, 'Y-M-D')}</div>
      },
    },
    {
      title: formatMessage({ id: '预估金额' }),
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div>
            {value.price}
            {formatMessage({ id: '万元' })}
          </div>
        )
      },
    },
  ]

  const loadAssociationItems = async () => {
    try {
      const res = await getBusinessEnquiryList({
        isInquiry: false,
        sort: 'create_time desc',
        powerType: 1,
        customerId: detailId,
      })
      setTableData(res)
    } catch (error) {}
  }

  const jumpDetail = (number: string) => {
    navigate(`/projectManage/saleProject?id=${number}`)
  }

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={false}
      rowKey="id"
      scroll={{ x: 'max-content', y: 428 }}
    />
  )
})

export default AssociationItems
