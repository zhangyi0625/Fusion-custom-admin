import React, { useState } from 'react'
import type { SaleContractType } from '@/services/contractManage/SalesContract/SalesContractModel'
import { App, Button, Space, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import AddSalesContract, {
  AddSalesContractProps,
} from '@/views/contractManage/SalesContract/AddSalesContract'
import {
  addContractManage,
  getContractManage,
  updateContractManage,
} from '@/services/contractManage/SalesContract/SalesContractApi'
import { filterKeys } from '@/utils/tool'
import { formatTime } from '@/utils/format'
import { AddSalesContractForm } from '@/views/contractManage/config'
import { postDownlFile } from '@/services/upload/UploadApi'

export type SalesContractProps = {
  projectId: string
}

const SalesContract: React.FC<SalesContractProps> = ({ projectId }) => {
  const [immediate, setImmediate] = useState<boolean>(false)

  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    salesProjectId: projectId,
    source: 'S',
  })

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
      key: 'number',
      align: 'center',
      render(value) {
        return (
          <div className="text-blue-500 cursor-pointer">{value.number}</div>
        )
      },
      width: 200,
    },
    {
      title: '合同名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '合同类型',
      key: 'type',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.type === 'FRAMEWORK' ? '框架合同' : '即期合同'}</div>
      },
    },
    {
      title: '合同金额',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: 100,
    },
    {
      title: '已执行金额',
      key: 'invoicePrice',
      dataIndex: 'invoicePrice',
      align: 'center',
      width: 150,
    },
    {
      title: '已开票金额',
      key: 'receiptPrice',
      dataIndex: 'receiptPrice',
      align: 'center',
      width: 150,
    },
    {
      title: '合同日期',
      key: 'contractTime',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.contractTime, 'Y-M-D')}</div>
      },
    },
    {
      title: '合同状态',
      key: 'status',
      align: 'center',
      width: 150,
      render(value) {
        let options = AddSalesContractForm.find(
          (item) => item.name === 'status'
        )?.options
        return options?.find((item) => item.value === value.status)?.label
      },
    },
    {
      title: '创建者',
      key: 'createName',
      dataIndex: 'createName',
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
            <Button
              onClick={() => downLoadFile(_.fileId, _.fileName)}
              type="link"
            >
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

  const downLoadFile = (fileId: string, fileName: string) => {
    if (!fileId) return
    postDownlFile(fileId).then((resp) => {
      let blobUrl = window.URL.createObjectURL(resp)
      const aElement = document.createElement('a')
      document.body.appendChild(aElement)
      aElement.style.display = 'none'
      aElement.href = blobUrl
      aElement.download = fileName
      aElement.click()
      document.body.removeChild(aElement)
    })
  }

  const onEditOk = async (customerRow: SaleContractType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addContractManage({ ...customerRow, source: 'S' })
      } else {
        // 编辑数据
        await updateContractManage({ ...customerRow, source: 'S' })
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, source: 'SaleProject' })
      onUpdateSearch(searchDefaultForm)
    } catch (error) {}
  }

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'isInquiry', 'status'],
      true
    )
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
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
        searchFilter={searchDefaultForm}
        fetchData={getContractManage}
        isSelection={false}
        isPagination={false}
        scroll={{ x: 'max-content', y: 208 }}
        onUpdatePagination={() => {}}
      />
      <AddSalesContract
        params={params as AddSalesContractProps['params']}
        onCancel={() =>
          setParams({
            visible: false,
            currentRow: null,
            source: 'SaleProject',
          })
        }
        onOk={onEditOk}
      />
    </>
  )
}

export default SalesContract
