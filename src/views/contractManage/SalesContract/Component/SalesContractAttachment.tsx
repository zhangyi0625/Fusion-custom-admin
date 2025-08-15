import React, { memo, useEffect, useState } from 'react'
import { App, Button, Space, Table, TableProps } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  addContractAttachment,
  deleteContractAttachment,
  getContractAttachment,
} from '@/services/contractManage/SalesContract/SalesContractApi'
import { SaleContractAttachmentType } from '@/services/contractManage/SalesContract/SalesContractModel'
import { postDownlFile } from '@/services/upload/UploadApi'
import AttachemntModal from '@/components/AttachementModal'

export type SalesContractAttachmentProps = {
  detailId: string
}

const SalesContractAttachment: React.FC<SalesContractAttachmentProps> = memo(
  ({ detailId }) => {
    const { modal, message } = App.useApp()

    const [dataSource, setDataSource] = useState([])

    const [params, setParams] = useState<{
      visible: boolean
      currentRow: SaleContractAttachmentType | null
    }>({
      visible: false,
      currentRow: null,
    })

    const [visible, setVisible] = useState<boolean>(false)

    useEffect(() => {
      detailId && loadContractAttachment()
    }, [detailId])

    const loadContractAttachment = async () => {
      const res = await getContractAttachment(detailId)
      setDataSource(res)
    }

    const tableColumns: TableProps['columns'] = [
      {
        title: '文件名称',
        key: 'fileName',
        dataIndex: 'fileName',
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

    const deleteItem = (id: string) => {
      modal.confirm({
        title: '删除合同附件',
        icon: <ExclamationCircleFilled />,
        content: '确定删除该合同附件吗？数据删除后将无法恢复！',
        onOk() {
          deleteContractAttachment(id).then(() => {
            loadContractAttachment()
          })
        },
      })
    }

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

    const importAttachmentSuccess = (current: any) => {
      addContractAttachment({
        contractId: detailId,
        fileId: current['fileId'],
      }).then(() => {
        message.success('添加成功')
        setVisible(false)
        loadContractAttachment()
      })
    }

    return (
      <>
        <div className="w-full flex items-center justify-end mb-[8px]">
          <Space>
            <Button onClick={() => setVisible(true)} type="primary">
              添加附件
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
        <AttachemntModal
          title="添加附件"
          visible={visible}
          uploadFileKey="fileId"
          onCancel={() => setVisible(false)}
          onOk={importAttachmentSuccess}
          uploadAccept={['.doc', '.docx', '.pdf ', '.jpg']}
        />
      </>
    )
  }
)

export default SalesContractAttachment
