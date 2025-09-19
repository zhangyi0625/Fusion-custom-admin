import { memo } from 'react'
import type { BaseInfoDetail } from '../BusinessEnquiryDrawer'

export type BaseInfoComProps = {
  detail: BaseInfoDetail[]
}

const BaseInfoCom: React.FC<BaseInfoComProps> = memo(({ detail }) => {
  return (
    <>
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px]">
        {(detail || []).map((item) => (
          <div key={item.label} className="flex items-center">
            {item.label}
            <span className="text-dull-grey">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  )
})

export default BaseInfoCom
