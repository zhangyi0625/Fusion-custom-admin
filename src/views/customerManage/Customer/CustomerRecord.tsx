import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Space, Tabs, TabsProps } from 'antd'
import { getCustomerDetail } from '@/services/customerManage/Customer/CustomerApi'
import type { CustomerType } from '@/services/customerManage/Customer/CustomerModel'
import FollowRecord from '@/views/projectManage/SaleProject/Component/FollowRecord'
import OperationRecord, {
  OperationRecordRef,
} from './component/operationRecord'
import AssociationItems, {
  AssociationItemsRef,
} from './component/associationItems'

export type CustomerRecordProps = {
  params: {
    visible: boolean
    id: string
  }
  onCancel: () => void
}

const CustomerRecord: React.FC<CustomerRecordProps> = ({
  params,
  onCancel,
}) => {
  const { visible, id } = params

  const [customerInfo, setCustomerInfo] = useState<{
    info: Partial<CustomerType>
  }>({
    info: {},
  })

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('followRecord')

  const OperationRecordComRef = useRef<OperationRecordRef>(null)

  const AssociationItemsRef = useRef<AssociationItemsRef>(null)

  const components: TabsProps['items'] = [
    {
      label: '跟进记录',
      key: 'followRecord',
      children: (
        <FollowRecord
          isCustomer={true}
          detail={customerInfo.info as any}
          projectId={customerInfo.info.id as string}
        />
      ),
    },
    {
      label: '关联项目',
      key: 'associationItems',
      children: (
        <AssociationItems
          ref={AssociationItemsRef}
          detailId={customerInfo.info.id as string}
        />
      ),
    },
    {
      label: '操作记录',
      key: 'operationRecord',
      children: (
        <OperationRecord
          ref={OperationRecordComRef}
          detailId={customerInfo.info.id as string}
        />
      ),
    },
  ]

  useEffect(() => {
    if (!visible) return
    init()
  }, [visible])

  const init = () => {
    Promise.all([getCustomerDetail(id)]).then((resp) => {
      setCustomerInfo({ info: resp[0] })
    })
  }

  const onChange = (value: string) => {
    setDefaultActiveKey(value)
    if (value === 'associationItems') {
      AssociationItemsRef.current?.onRefresh()
    } else if (value === 'operationRecord') {
      OperationRecordComRef.current?.onRefresh()
    } else if (value === 'followRecord') {
      init()
    }
  }

  return (
    <Drawer
      title="客户详情"
      width={912}
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
        <p>
          单位名称：
          <span className="text-dull-grey">
            {customerInfo.info.refCompanyName ?? customerInfo.info.companyName}
          </span>
        </p>
        <p>
          客户来源：
          <span className="text-dull-grey">{customerInfo.info.source} </span>
        </p>
        <p>
          客户级别：
          <span className="text-dull-grey">{customerInfo.info.level}</span>
        </p>
        <p>
          备注：
          <span className="text-dull-grey">{customerInfo.info.remark} </span>
        </p>
      </div>
      <Tabs
        items={components}
        activeKey={defaultActiveKey}
        onChange={onChange}
        key={customerInfo.info.id}
      />
    </Drawer>
  )
}

export default CustomerRecord
