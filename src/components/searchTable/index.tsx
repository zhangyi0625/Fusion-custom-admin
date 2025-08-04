import React, { memo, useEffect, useState } from 'react'
import { Spin, Table, TableProps } from 'antd'
import { TablePaginationConfig } from 'antd/lib'
import { useDispatch } from 'react-redux'
import { setEssentail } from '@/stores/store'

type OrderTableObject = {
  orderNo: string
  affiliateName: string
  customerName: string
  [key: string]: any
}

interface SearchTableProps<T = any>
  extends Omit<TableProps<T>, 'columns' | 'datasource'> {
  columns: TableProps['columns']
  fetchData: (pagination: TablePaginationConfig | any) => Promise<any>
  searchFilter?: any
  rowKey: string
  isSelection: boolean
  isPagination?: boolean
  selectionParentType?: 'checkbox' | 'radio'
  immediate?: boolean
  // Todo ： 缓存部分基数数据 用于redux
  isCache?: string
  onUpdatePagination: (pagination: TablePaginationConfig) => void
  onUpdateSelection?: (idAdrr: string[], dataRow?: any) => void
}

const searchTable: React.FC<SearchTableProps> = memo((props) => {
  const {
    columns,
    fetchData,
    searchFilter,
    rowKey,
    isSelection,
    isPagination,
    scroll,
    selectionParentType,
    immediate,
    isCache,
    onUpdatePagination,
    onUpdateSelection,
  } = props

  const dispatch = useDispatch()

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const [currentPagination, setCurrentPagination] =
    useState<TablePaginationConfig>({
      current: 1,
      pageSize: 10,
      total: 0,
    })

  const loadTableData = async (paginationConfig = currentPagination) => {
    setLoading(true)
    try {
      const response = await fetchData(searchFilter)
      let resp =
        Object.keys(response).length > 0
          ? response.list ?? response.results
          : response
      console.log(resp, 'response', response, isCache)
      isCache && dispatch(setEssentail({ value: resp, key: isCache }))
      setTableData(resp)
      setCurrentPagination({
        ...paginationConfig,
        total: Number(response.count),
      })
      setSelectedRowKeys([])
    } catch {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!immediate) {
      loadTableData()
    }
    setSelectionType(selectionParentType ?? selectionType)
    console.log(props, 'props')
  }, [
    currentPagination.pageSize,
    currentPagination.pageSizeOptions,
    searchFilter,
    immediate,
    selectionParentType,
  ])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // if (isPagination) {
    setCurrentPagination({
      ...currentPagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    onUpdatePagination(pagination)
    // }
  }

  const rowSelection: TableProps['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      if (onUpdateSelection && isSelection)
        onUpdateSelection(
          selectedRows.map((item: any) => item[rowKey]),
          selectedRows
        )
      setSelectedRowKeys(selectedRows.map((item: any) => item[rowKey]))
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <Spin spinning={loading}>
      <Table
        size={props.size}
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={currentPagination}
        onChange={handleTableChange}
        rowKey={rowKey}
        scroll={scroll}
        rowSelection={
          isSelection
            ? {
                type: selectionType,
                ...rowSelection,
              }
            : undefined
        }
      />
    </Spin>
  )
})

export default searchTable
