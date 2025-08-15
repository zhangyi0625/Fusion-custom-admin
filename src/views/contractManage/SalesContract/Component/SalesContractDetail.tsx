import React, { memo } from 'react'
import type { BaseInfoDetail } from '../SalesContractDrawer'

export type SalesContractDetailProps = {
  detail: BaseInfoDetail[]
}

const SalesContractDetail: React.FC<SalesContractDetailProps> = memo(
  ({ detail }) => {
    // const
    return (
      <>
        <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px]">
          {(detail.slice(0, detail.length - 4) || []).map((item) => (
            <p key={item.label}>
              {item.label}
              <span className="text-dull-grey">{item.value}</span>
            </p>
          ))}
        </div>
        <div className="text-base font-semibold text-dull-grey mb-[8px]">
          操作信息
        </div>
        <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px]">
          {(detail.slice(detail.length - 4, detail.length) || []).map(
            (item) => (
              <p key={item.label}>
                {item.label}
                <span className="text-dull-grey">{item.value}</span>
              </p>
            )
          )}
        </div>
      </>
    )
  }
)

export default SalesContractDetail
