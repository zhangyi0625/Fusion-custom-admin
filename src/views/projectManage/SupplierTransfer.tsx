import DragModal from '@/components/modal/DragModal'
import { getSupplierList } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import { Transfer, TransferProps } from 'antd'
import React, { memo, useEffect, useState } from 'react'

export type SupplierTransferProps = {
  params: {
    visible: boolean
    selected: string[] | null
  }
  onOk: (params: string[]) => void
  onCancel: () => void
}

type RecordType = {
  title: string
  supplierNo: string
  supplierName: string
}

const SupplierTransfer: React.FC<SupplierTransferProps> = memo(
  ({ params, onOk, onCancel }) => {
    const { visible, selected } = params

    const [mockData, setMockData] = useState<RecordType[]>([])
    const [targetKeys, setTargetKeys] = useState<React.Key[]>([])

    useEffect(() => {
      if (!visible) return
      loadAllSupplier()
    }, [visible])

    const loadAllSupplier = async () => {
      const res = await getSupplierList()
      let newRes = res.map((item: RecordType) => {
        return {
          ...item,
          key: item.supplierNo,
          title: item.supplierName,
        }
      })
      setMockData(newRes)
      setTargetKeys(['P202507007'])
    }

    const onChange: TransferProps['onChange'] = (newTargetKeys) => {
      setTargetKeys(newTargetKeys)
    }

    const onConfirm = () => {}

    const filterOption = (input: string, item: RecordType) =>
      item.supplierNo?.includes(input) || item.supplierName?.includes(input)

    return (
      <DragModal
        width="40%"
        open={visible}
        title="新增供应商"
        onOk={onConfirm}
        onCancel={onCancel}
      >
        <Transfer
          showSearch
          style={{ width: '100%' }}
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={onChange}
          filterOption={filterOption}
          render={(item) => item.title}
          pagination
        />
      </DragModal>
    )
  }
)

export default SupplierTransfer
