import { useEffect, useState } from 'react'
import { App, Button, Space, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import type { ContractsType } from '@/services/supplierManage/Contracts/ContractsModel'
import { getSupplierContracts } from '@/services/supplierManage/Supplier/SupplierApi'
import AddContract from '../Contracts/AddContracts'
import {
  addContracts,
  updateContracts,
} from '@/services/supplierManage/Contracts/ContractsApi'

export type SupplierContractsProps = {
  id: string
  contactId: string | null
  onUpdateContract: (id: string[]) => void
}

const SupplierContracts: React.FC<SupplierContractsProps> = ({
  id,
  contactId,
  onUpdateContract,
}) => {
  const { message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState<
    Pick<ContractsType, 'supplierId'>
  >({
    supplierId: '',
  })

  const [immediate, setImmediate] = useState<boolean>(true)

  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setImmediate(true)
    if (!id) return
    setSearchDefaultForm({ supplierId: id })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }, [id])

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: ContractsType | null
    source: 'Supplier'
  }>({
    visible: false,
    currentRow: null,
    source: 'Supplier',
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '联系人姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号',
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      width: 100,
    },
    {
      title: '是否为主联系人',
      key: 'contactKeyword',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.id === contactId ? '是' : '否'}</div>
      },
    },
  ]

  const setContract = () => {
    if (selected.length === 0) {
      message.error('至少选择一个联系人！')
    }
    onUpdateContract(selected)
    setTimeout(() => {
      setSearchDefaultForm({ ...searchDefaultForm })
    }, 300)
  }

  const onEditOk = async (customerRow: ContractsType) => {
    let info = { ...customerRow, supplierId: id }
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addContracts(info)
      } else {
        // 编辑数据
        await updateContracts(info)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, source: 'Supplier' })
      setSearchDefaultForm({ ...searchDefaultForm })
    } catch (error) {}
  }

  return (
    <>
      <div className="w-full flex items-center justify-end mb-[8px]">
        <Space>
          <Button onClick={setContract} type="default">
            设为主联系人
          </Button>
          <Button
            onClick={() =>
              setParams({ visible: true, currentRow: null, source: 'Supplier' })
            }
            type="primary"
          >
            添加联系人
          </Button>
        </Space>
      </div>
      <SearchTable
        size="middle"
        columns={tableColumns}
        bordered
        rowKey="id"
        totalKey="count"
        fetchResultKey="list"
        fetchData={getSupplierContracts}
        searchFilter={searchDefaultForm}
        immediate={immediate}
        multipleSelected={[contactId] as string[]}
        isSelection={true}
        isPagination={false}
        selectionParentType="radio"
        onUpdatePagination={() => {
          return
        }}
        onUpdateSelection={(options: string[]) => setSelected(options)}
      />
      <AddContract
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, source: 'Supplier' })
        }
      />
    </>
  )
}

export default SupplierContracts
