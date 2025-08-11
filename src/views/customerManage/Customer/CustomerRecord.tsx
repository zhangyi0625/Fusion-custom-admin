import React, { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  Space,
  Tabs,
  TabsProps,
  Timeline,
  TimelineItemProps,
} from 'antd'
import {
  getCustomerDetail,
  getCustomerRecord,
} from '@/services/customerManage/Customer/CustomerApi'
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'

export type CustomerRecordProps = {
  params: {
    visible: boolean
    id: string
  }
  onCancel: () => void
}

const components: TabsProps['items'] = [
  {
    label: '操作记录',
    key: 'editRecord',
    // children: <EditRecord />,
  },
]

const CustomerRecord: React.FC<CustomerRecordProps> = ({
  params,
  onCancel,
}) => {
  const { visible, id } = params

  const [customerInfo, setCustomerInfo] = useState<{
    info: Partial<CustomerType>
    record: TimelineItemProps[]
  }>({
    record: [],
    info: {},
  })

  useEffect(() => {
    if (!visible) return
    init()
  }, [visible])

  const init = () => {
    Promise.all([getCustomerDetail(id), getCustomerRecord(id)]).then((resp) => {
      let newLine = resp[1].map(
        (item: { createTime: string; createName: string; content: string }) => {
          return {
            children: (
              <div className="text-gray-400">
                {item.createTime}
                <span className="ml-[16px]">{item.createName ?? ''}</span>
                <p className="text-dull-grey">{item.content ?? ''}</p>
              </div>
            ),
          }
        }
      )
      setCustomerInfo({ info: resp[0], record: newLine })
    })
  }

  return (
    <Drawer
      title="客户详情"
      width={720}
      open={visible}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px] text-sm">
        <p>
          客户名称：
          <span className="text-dull-grey">{customerInfo.info.name}</span>
        </p>
        <p>
          手机号：
          <span className="text-dull-grey">{customerInfo.info.phone} </span>
        </p>
      </div>
      <Tabs items={components} />
      <Timeline items={customerInfo.record} />
    </Drawer>
  )
}

export default CustomerRecord
