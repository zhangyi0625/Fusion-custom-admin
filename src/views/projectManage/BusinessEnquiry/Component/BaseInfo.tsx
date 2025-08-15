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
          <p key={item.label}>
            {item.label}
            <span className={`${item.className} text-dull-grey`}>
              {item.value}
            </span>
          </p>
        ))}
      </div>
    </>
  )
})

export default BaseInfoCom
