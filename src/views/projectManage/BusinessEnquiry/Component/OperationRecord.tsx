import { Timeline } from 'antd'
import { memo } from 'react'

export type OperationRecordProps = {}

const OperationRecordCom: React.FC<OperationRecordProps> = memo(() => {
  const operationRecord = [
    {
      children: (
        <div className="text-gray-400">
          2015-08-22 12:00:00<span className="ml-[16px]">赛锦悦</span>
          <p className="text-dull-grey">中止销售项目</p>
        </div>
      ),
    },
  ]

  return (
    <>
      <Timeline items={operationRecord} />
    </>
  )
})

export default OperationRecordCom
