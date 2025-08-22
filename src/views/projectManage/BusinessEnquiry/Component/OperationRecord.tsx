import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Timeline } from 'antd'
import { getBusinessOperationRecord } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import type { BussinesOperationRecordType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

export type OperationRecordProps = {
  projectId: string
}

export type OperationRecordRef = {
  onRefresh: () => void
}

const OperationRecordCom = React.forwardRef<
  OperationRecordRef,
  OperationRecordProps
>(({ projectId }, ref) => {
  const [operationRecord, setOperationRecord] = useState([])

  useEffect(() => {
    projectId && loadBusinessOperationRecord()
  }, [projectId])

  useImperativeHandle(ref, () => ({
    onRefresh: () => loadBusinessOperationRecord(),
  }))

  const loadBusinessOperationRecord = () => {
    getBusinessOperationRecord(projectId).then((resp) => {
      let data = resp.map((item: BussinesOperationRecordType) => {
        return {
          children: (
            <div className="text-gray-400">
              {item.createTime}
              <span className="ml-[16px]">{item.createName}</span>
              <p className="text-dull-grey">{item.content}</p>
            </div>
          ),
        }
      })
      setOperationRecord(data)
    })
  }

  return (
    <>
      <Timeline items={operationRecord} />
    </>
  )
})

export default OperationRecordCom
