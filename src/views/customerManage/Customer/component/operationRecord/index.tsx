import { getCustomerRecord } from '@/services/customerManage/Customer/CustomerApi'
import { Empty, Timeline } from 'antd'
import React, { useEffect, useImperativeHandle, useState } from 'react'

export type OperationRecordRef = {
  onRefresh: () => void
}

export type OperationRecordProps = {
  detailId: string
}

const OperationRecordCom = React.forwardRef<
  OperationRecordRef,
  OperationRecordProps
>(({ detailId }, ref) => {
  const [operationRecord, setOperationRecord] = useState([])

  useEffect(() => {
    detailId && loadOperationRecord()
  }, [detailId])

  useImperativeHandle(ref, () => ({
    onRefresh: () => loadOperationRecord(),
  }))

  const loadOperationRecord = () => {
    getCustomerRecord(detailId as string).then((resp) => {
      let newLine = resp.map(
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
        },
      )
      setOperationRecord(newLine)
    })
  }
  return (
    <>
      <Timeline items={operationRecord} />
      {!operationRecord.length && (
        <Empty description="暂无操作记录" style={{ marginTop: '80px' }} />
      )}
    </>
  )
})

export default OperationRecordCom
