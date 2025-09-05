import React, { useEffect, useMemo } from 'react'
import { Table, TableProps } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { ProductManageType } from '@/services/productManage/productManageModel'

export type OpenQuotationDetailProps = {
  params: {
    visible: boolean
    currentRow: { items: ProductManageType[] } | null
  }
  onCancel: () => void
}

const OpenQuotationDetail: React.FC<OpenQuotationDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params

  useEffect(() => {
    if (!visible) return
  }, [visible])

  const supplierQuotationTableColumns: TableProps<ProductManageType>['columns'] =
    [
      {
        title: '序号',
        width: 70,
        render: (_, _blank, index) => `${index + 1}`,
        align: 'center',
      },
      {
        title: '产品名称',
        key: 'name',
        dataIndex: 'name',
        align: 'center',
        width: 250,
      },
      {
        title: '单位',
        key: 'unit',
        dataIndex: 'unit',
        align: 'center',
        width: 100,
      },
      {
        title: '数量',
        key: 'qty',
        dataIndex: 'qty',
        align: 'center',
        width: 100,
      },
      {
        title: '产品单价',
        key: 'amount',
        dataIndex: 'amount',
        align: 'center',
        width: 100,
      },
    ]

  const getSum = useMemo(() => {
    const value = (currentRow?.items ?? []).reduce(
      (total: number, item: ProductManageType) => {
        return total + Number(item.amount)
      },
      0
    )
    return value.toFixed(1)
  }, [currentRow])

  return (
    <DragModal
      width="50%"
      open={visible}
      title="报价明细"
      onClose={onCancel}
      footer={
        <div className="w-full mt-[8px] flex items-center justify-end">
          <span>报价总金额</span>
          <span className="text-red-500 mx-[20px]">{getSum}</span>
        </div>
      }
      styles={{
        footer: {
          padding: '10px 0',
        },
      }}
    >
      <Table<ProductManageType>
        bordered
        rowKey={'id'}
        size="small"
        columns={supplierQuotationTableColumns}
        dataSource={currentRow?.items ?? []}
        scroll={{ x: 'max-content', y: 588 }}
        pagination={false}
      />
    </DragModal>
  )
}

export default OpenQuotationDetail
