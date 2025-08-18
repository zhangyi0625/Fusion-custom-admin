import React, { memo, useEffect, useState } from 'react'
import { Transfer, TransferProps } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { getSupplier } from '@/services/supplierManage/Supplier/SupplierApi'

export type SupplierTransferProps = {
  params: {
    visible: boolean
    selected: string[] | null
  }
  projectId: string
  onOk: (params: string[]) => void
  onCancel: () => void
}

type RecordType = {
  title: string
  name: string
  id: string
}

const SupplierTransfer: React.FC<SupplierTransferProps> = memo(
  ({ params, projectId, onOk, onCancel }) => {
    const { visible, selected } = params

    const [mockData, setMockData] = useState<RecordType[]>([])
    const [targetKeys, setTargetKeys] = useState<React.Key[]>([])

    useEffect(() => {
      if (!visible) return
      loadAllSupplier()
    }, [visible])

    const loadAllSupplier = async () => {
      const res = await getSupplier({})
      let newRes = res.map((item: RecordType) => {
        return {
          ...item,
          key: item.id,
          title: item.name,
        }
      })
      setMockData(newRes)
      selected?.length && setTargetKeys(selected)
    }

    const onChange: TransferProps['onChange'] = (newTargetKeys) => {
      setTargetKeys(newTargetKeys)
    }

    const onConfirm = () => {
      onOk(targetKeys as string[])
    }

    const filterOption = (input: string, item: RecordType) =>
      item.name?.includes(input)

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
