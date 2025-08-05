import React, { useEffect, useState } from 'react'
import DragModal from '@/components/modal/DragModal'
import { Table, Transfer } from 'antd'
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd'
import { getProductList } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'

export type ProductTransferProps = {
  params: {
    visible: boolean
    selected: string[] | null
  }
  onOk: (params: string[]) => void
  onCancel: () => void
}

type TransferItem = GetProp<TransferProps, 'dataSource'>[number]
type TableRowSelection<T extends object> = TableProps<T>['rowSelection']

type DataSourceType = {
  productName: string
  productNo: string
  productSpecifications: string
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataSourceType[]
  leftColumns: TableColumnsType<DataSourceType>
  rightColumns: TableColumnsType<DataSourceType>
}

const ProductTransfer: React.FC<ProductTransferProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, selected } = params

  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])

  const [mockData, setMockData] = useState<DataSourceType[]>([])

  useEffect(() => {
    if (!visible) return
    loadAllProduct()
  }, [visible])

  const loadAllProduct = async () => {
    const res = await getProductList()
    let newRes = res.map((item: DataSourceType) => {
      return {
        ...item,
        key: item.productNo,
        title: item.productName,
      }
    })
    setMockData(newRes)
    setTargetKeys(['P202507007'])
  }

  const onConfirm = () => {
    console.log(targetKeys, 'targetKeys')
    onOk(targetKeys as string[])
  }

  const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props
    return (
      <Transfer style={{ width: '100%' }} {...restProps}>
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns
          const rowSelection: TableRowSelection<TransferItem> = {
            getCheckboxProps: () => ({ disabled: listDisabled }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace')
            },
            selectedRowKeys: listSelectedKeys,
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_INVERT,
              Table.SELECTION_NONE,
            ],
          }

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              rowKey="productNo"
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key))
                },
              })}
            />
          )
        }}
      </Transfer>
    )
  }

  const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys)
  }

  const filterOption = (input: string, item: DataSourceType) =>
    item.productName?.includes(input) || item.productNo?.includes(input)

  const columns: TableColumnsType<DataSourceType> = [
    {
      dataIndex: 'productName',
      key: 'productName',
      title: '产品名称',
    },
    {
      dataIndex: 'productNo',
      key: 'productNo',
      title: '产品编号',
    },
    {
      dataIndex: 'productSpecifications',
      key: 'productSpecifications',
      title: '规格型号',
    },
  ]

  return (
    <DragModal
      width="65%"
      open={visible}
      title="选择产品"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        showSearch
        showSelectAll={false}
        onChange={onChange}
        filterOption={filterOption}
        leftColumns={columns}
        rightColumns={columns}
      />
    </DragModal>
  )
}

export default ProductTransfer
