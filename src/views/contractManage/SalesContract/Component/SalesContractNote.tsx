import React, { memo, useEffect, useState } from 'react'
import { App, Button, Space, Table, TableProps } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  addContractNote,
  deleteContractNote,
  getContractNote,
  updateContractNote,
} from '@/services/contractManage/SalesContract/SalesContractApi'
import type { SaleContractNoteType } from '@/services/contractManage/SalesContract/SalesContractModel'
import AddSalesContractNote from './AddSalesContractNote'
import { formatTime } from '@/utils/format'

export type SalesContractNoteProps = {
  detailId: string
}

const SalesContractNote: React.FC<SalesContractNoteProps> = memo(
  ({ detailId }) => {
    const { modal, message } = App.useApp()

    const [dataSource, setDataSource] = useState([])

    const [params, setParams] = useState<{
      visible: boolean
      currentRow: SaleContractNoteType | null
    }>({
      visible: false,
      currentRow: null,
    })

    useEffect(() => {
      detailId && loadContractAttachment()
    }, [detailId])

    const loadContractAttachment = async () => {
      const res = await getContractNote(detailId)
      setDataSource(res)
    }

    const tableColumns: TableProps['columns'] = [
      {
        title: '日期',
        key: 'fileName',
        align: 'center',
        width: 100,
        render(value) {
          return <div>{formatTime(value.invoiceDate, 'Y-M-D')}</div>
        },
      },
      {
        title: '款项类型',
        key: 'type',
        align: 'center',
        width: 100,
        render(value) {
          return <div>{value.type === 'INVOICE' ? '开票' : '收款'}</div>
        },
      },
      {
        title: '金额',
        key: 'amount',
        dataIndex: 'amount',
        align: 'center',
        width: 100,
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        align: 'center',
        width: 200,
      },
      {
        title: '创建者',
        key: 'createName',
        dataIndex: 'createName',
        align: 'center',
        width: 120,
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
                onClick={() => setParams({ visible: true, currentRow: _ })}
                type="link"
              >
                编辑
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

    const deleteItem = (id: string) => {
      modal.confirm({
        title: '删除款项登记',
        icon: <ExclamationCircleFilled />,
        content: '确定删除该款项登记吗？数据删除后将无法恢复！',
        onOk() {
          deleteContractNote(id).then(() => {
            message.success('删除成功')
            loadContractAttachment()
          })
        },
      })
    }

    const onEditOk = async (customerRow: SaleContractNoteType) => {
      try {
        if (params.currentRow == null) {
          // 新增数据
          await addContractNote({ ...customerRow, contractId: detailId })
        } else {
          // 编辑数据
          await updateContractNote({ ...customerRow, contractId: detailId })
        }
        message.success(!params.currentRow ? '添加成功' : '修改成功')
        // 操作成功，关闭弹窗，刷新数据
        setParams({ visible: false, currentRow: null })
        loadContractAttachment()
      } catch (error) {}
    }

    return (
      <>
        <div className="w-full flex items-center justify-end mb-[8px]">
          <Space>
            <Button
              onClick={() => setParams({ visible: true, currentRow: null })}
              type="primary"
            >
              添加款项
            </Button>
          </Space>
        </div>
        {detailId && (
          <Table
            size="middle"
            columns={tableColumns}
            bordered
            rowKey="id"
            dataSource={dataSource}
            scroll={{ x: 'max-content', y: 208 }}
          />
        )}
        <AddSalesContractNote
          params={params}
          onCancel={() =>
            setParams({
              visible: false,
              currentRow: null,
            })
          }
          onOk={onEditOk}
        />
      </>
    )
  }
)

export default SalesContractNote
