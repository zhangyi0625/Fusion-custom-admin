import React, { useState } from 'react'
import type { SaleContractType } from '@/services/contractManage/SalesContract/SalesContractModel'
import { Button, Space, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import AddSalesContract, {
  AddSalesContractProps,
} from '@/views/contractManage/SalesContract/AddSalesContract'

export type SalesContractProps = {}

const SalesContract: React.FC<SalesContractProps> = () => {
  const [immediate, setImmediate] = useState<boolean>(false)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: Omit<
      SaleContractType,
      'productNo' | 'productName' | 'customerId' | 'payer'
    > | null
    source: string
  }>({
    visible: false,
    currentRow: null,
    source: 'SaleProject',
  })

  const tableColumns: TableProps['columns'] = [
    {
      title: '合同编号',
      key: 'contractNo',
      align: 'center',
      render(value) {
        return (
          <div className="text-blue-500 cursor-pointer">{value.contractNo}</div>
        )
      },
    },
    {
      title: '合同名称',
      key: 'contractName',
      dataIndex: 'contractName',
      align: 'center',
      width: 200,
    },
    {
      title: '合同类型',
      key: 'contractType',
      dataIndex: 'contractType',
      align: 'center',
    },
    {
      title: '合同金额',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '已执行金额',
      key: 'salesman',
      dataIndex: 'salesman',
      align: 'center',
      width: 150,
    },
    {
      title: '已开票金额',
      key: 'expectedDate',
      dataIndex: 'expectedDate',
      align: 'center',
      width: 180,
    },
    {
      title: '合同日期',
      key: 'projectType',
      dataIndex: 'projectType',
      align: 'center',
    },
    {
      title: '合同状态',
      key: 'status',
      align: 'center',
      width: 150,
    },
    {
      title: '创建者',
      key: 'createdr',
      dataIndex: 'creater',
      align: 'center',
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              onClick={() =>
                setParams({
                  visible: true,
                  currentRow: _,
                  source: 'SaleProject',
                })
              }
              type="link"
            >
              编辑
            </Button>
            <Button onClick={() => downloadData(_)} type="link">
              下载
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="link"
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const downloadData = (_: SaleContractType) => {}

  const onEditOk = async (customerRow: SaleContractType) => {
    // try {
    //   if (params.currentRow == null) {
    //     // 新增数据
    //     await addBusinessEnquiryList(customerRow)
    //   } else {
    //     // 编辑数据
    //     await updateBusinessEnquiryList(customerRow)
    //   }
    //   message.success(!params.currentRow ? '添加成功' : '修改成功')
    //   // 操作成功，关闭弹窗，刷新数据
    //   setParams({ visible: false, currentRow: null })
    //   onUpdateSearch()
    // } catch (error) {}
  }

  const deleteItem = (id: string) => {}

  return (
    <>
      <div className="flex justify-end mb-[10px]">
        <Space>
          <Button
            onClick={() =>
              setParams({
                visible: true,
                currentRow: null,
                source: 'SaleProject',
              })
            }
            type="primary"
          >
            新建合同
          </Button>
        </Space>
      </div>
      <SearchTable
        size="middle"
        columns={tableColumns}
        bordered
        rowKey="id"
        totalKey="total"
        fetchResultKey="data"
        immediate={immediate}
        fetchData={getBusinessEnquiryListPage}
        isSelection={false}
        isPagination={false}
        onUpdatePagination={() => {}}
      />
      <AddSalesContract
        params={params as AddSalesContractProps['params']}
        onCancel={() =>
          setParams({
            visible: false,
            currentRow: null,
            source: '',
          })
        }
        onOk={onEditOk}
      />
    </>
  )
}

export default SalesContract
