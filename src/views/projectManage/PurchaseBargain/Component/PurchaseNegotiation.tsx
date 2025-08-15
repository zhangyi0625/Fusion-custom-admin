import { CheckCircleOutlined } from '@ant-design/icons'
import React from 'react'

export type PurchaseNegotiationProps = {}

const PurchaseNegotiation: React.FC<PurchaseNegotiationProps> = () => {
  return (
    <div className="w-full flex items-center justify-end mb-[8px]">
      <div className="flex items-center text-green-500">
        <CheckCircleOutlined twoToneColor="#52C41A" />
        <p className="ml-[12px]">已确认采购价</p>
      </div>
    </div>
  )
}

export default PurchaseNegotiation
