import React, { useEffect } from 'react'
import { Button, Drawer, Space } from 'antd'

export type MyEnquiryDetailProps = {
  params: {
    visible: boolean
    currentRow: null
  }
  onCancel: () => void
}

const MyEnquiryDetail: React.FC<MyEnquiryDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params

  useEffect(() => {
    if (!visible) return
  }, [visible])

  return (
    <Drawer
      title="报价明细"
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
      <p className="font-semibold">客户询价基本信息</p>
    </Drawer>
  )
}

export default MyEnquiryDetail
