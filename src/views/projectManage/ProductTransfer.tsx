import React, { useEffect, useState } from 'react'
import DragModal from '@/components/modal/DragModal'
import { App, Table, Transfer } from 'antd'
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd'
import { getProductList } from '@/services/productManage/productManageApi'
import { ProductManageType } from '@/services/productManage/productManageModel'
import type { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

export type ProductTransferProps = {
  params: {
    visible: boolean
    selected: BussinesEnquiryProductType[] | null
  }
  projectId: string
  onOk: (params: BussinesEnquiryProductType[]) => void
  onCancel: () => void
}

type TransferItem = GetProp<TransferProps, 'dataSource'>[number]
type TableRowSelection<T extends object> = TableProps<T>['rowSelection']

type DataSourceType = ProductManageType

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataSourceType[]
  leftColumns: TableColumnsType<DataSourceType>
  rightColumns: TableColumnsType<DataSourceType>
}

const ProductTransfer: React.FC<ProductTransferProps> = ({
  params,
  projectId,
  onOk,
  onCancel,
}) => {
  const { visible, selected } = params

  const { message } = App.useApp()

  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])

  const [mockData, setMockData] = useState<DataSourceType[]>([])

  const [selectedArr, setSelectedArr] = useState<BussinesEnquiryProductType[]>(
    []
  )

  useEffect(() => {
    if (!visible) return
    setTargetKeys([])
    loadAllProduct()
  }, [visible])

  const loadAllProduct = async () => {
    const res = await getProductList({})
    let newRes = res.map((item: DataSourceType) => {
      return {
        ...item,
        key: item.name,
        title: item.name,
      }
    })
    let ids = selected?.map((item) => item.productName)
    setTargetKeys(ids)
    setSelectedArr(selected ?? [])
    setMockData(newRes)
  }

  const onConfirm = () => {
    let newArr: BussinesEnquiryProductType[] = []
    if (targetKeys?.length === 0) {
      message.error('至少选择一个产品！')
      return
    }
    let filterArr = mockData.filter(
      (item) => targetKeys?.includes(item.name)
      // &&
      //   !selectedArr.map((el) => el.productName).includes(item.name)
    )
    filterArr.map((item) => {
      newArr.push({
        productName: item.name,
        productSpec: item.spec,
        productUnit: item.unit,
        productModel: item.model,
        qty: 0,
        projectId: projectId,
      })
    })
    setSelectedArr(newArr.concat(selected as BussinesEnquiryProductType[]))
    // console.log(newArr, 'newArr', selectedArr, filterArr, targetKeys)
    onOk(newArr)
    // return
    // console.log(targetKeys, 'targetKeys', selectedArr, newArr, selected)
    // onOk(newArr.concat(selected as BussinesEnquiryProductType[]))
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
              rowKey="name"
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
    item.name?.includes(input) || item.pinyin?.includes(input)

  const columns: TableColumnsType<DataSourceType> = [
    {
      dataIndex: 'name',
      key: 'name',
      title: '产品名称',
    },
    {
      dataIndex: 'pinyin',
      key: 'pinyin',
      title: '拼音码',
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
        // disabled={disabled}
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
