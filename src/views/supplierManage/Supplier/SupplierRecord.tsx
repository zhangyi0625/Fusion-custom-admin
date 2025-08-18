import React, { useEffect, useState } from 'react'
import {
  App,
  Button,
  Drawer,
  Space,
  Tabs,
  TabsProps,
  Timeline,
  TimelineItemProps,
} from 'antd'
import {
  getSupplierDetail,
  getSupplierRecord,
  updateSupplier,
} from '@/services/supplierManage/Supplier/SupplierApi'
import type { SupplierType } from '@/services/supplierManage/Supplier/SupplierModel'
import SupplierContracts from './SupplierContracts'

export type SupplierRecordProps = {
  params: {
    visible: boolean
    id: string
  }
  onCancel: () => void
}

const SupplierRecord: React.FC<SupplierRecordProps> = ({
  params,
  onCancel,
}) => {
  const { visible, id } = params

  const { message } = App.useApp()

  const [supplierTypeInfo, setSupplierTypeInfo] = useState<{
    info: Partial<SupplierType>
    record: TimelineItemProps[]
  }>({
    record: [],
    info: {},
  })

  const [defaultActiveKey, setdefaultActiveKey] = useState<string>('contracts')

  useEffect(() => {
    if (!visible) return
    init(defaultActiveKey)
  }, [visible])

  const init = (key: string) => {
    Promise.all([
      getSupplierDetail(id),
      key === 'editRecord' && getSupplierRecord(id),
    ]).then((resp) => {
      let newLine = resp[1]
        ? resp[1].map(
            (item: {
              createTime: string
              createName: string
              content: string
            }) => {
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
        : []
      setSupplierTypeInfo({ info: resp[0], record: newLine })
    })
  }

  const EditRecord = () => {
    return <Timeline items={supplierTypeInfo.record} />
  }

  const onUpdateContract = (id: string[]) => {
    updateSupplier({
      ...supplierTypeInfo.info,
      contactId: id[0],
    } as SupplierType).then(() => {
      message.success('设置成功')
      init(defaultActiveKey)
    })
  }

  const components: TabsProps['items'] = [
    {
      label: '联系人',
      key: 'contracts',
      children: (
        <SupplierContracts
          id={id}
          contactId={supplierTypeInfo.info?.contactId as string}
          onUpdateContract={onUpdateContract}
        />
      ),
    },
    {
      label: '操作记录',
      key: 'editRecord',
      children: <EditRecord />,
    },
  ]

  const tabsChange = (key: string) => {
    setdefaultActiveKey(key)
    if (key === 'editRecord') init(key)
  }

  return (
    <Drawer
      title="供应商详情"
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
          供应商：
          <span className="text-dull-grey">{supplierTypeInfo.info.name}</span>
        </p>
        <p>
          社会统一信用代码：
          <span className="text-dull-grey">{supplierTypeInfo.info.code} </span>
        </p>
      </div>
      <Tabs
        activeKey={defaultActiveKey}
        items={components}
        onChange={tabsChange}
      />
    </Drawer>
  )
}

export default SupplierRecord
