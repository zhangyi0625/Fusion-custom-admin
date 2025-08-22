import React, { useEffect, useState } from 'react'
import { App, Button, Space, Table, TableProps } from 'antd'
import {
  addBusinessFollowRecord,
  deleteBusinessFollowRecord,
  getBusinessFollowRecord,
  updateBusinessFollowRecord,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import AddFollowRecord from './AddFollowRecord'
import { ExclamationCircleFilled } from '@ant-design/icons'
import type { BussinesFollowRecordType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { postDownlFile } from '@/services/upload/UploadApi'

export type FollowRecordProps = {
  projectId: string
}

const FollowRecord: React.FC<FollowRecordProps> = ({ projectId }) => {
  const { modal, message } = App.useApp()

  const [dataSource, setDataSource] = useState([])

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any | null
  }>({
    visible: false,
    currentRow: null,
  })

  useEffect(() => {
    if (projectId) {
      loadFollowRecord()
      setParams({ visible: false, currentRow: null })
    }
  }, [projectId])

  const tableColumns: TableProps['columns'] = [
    {
      title: '对接方',
      key: 'customerName',
      dataIndex: 'customerName',
      align: 'center',
      width: 120,
    },
    {
      title: '跟进时间',
      key: 'followedAt',
      dataIndex: 'followedAt',
      align: 'center',
      width: 180,
    },
    {
      title: '跟进内容',
      key: 'content',
      dataIndex: 'content',
      align: 'center',
      width: 250,
    },
    {
      title: '附件',
      key: 'fileName',
      align: 'center',
      width: 220,
      render(value) {
        return (
          <div
            className={
              value.fileId ? 'text-gray-500 cursor-pointer underline' : ''
            }
            onClick={() => download(value.fileId, value.fileName)}
          >
            {value.fileName ?? '-'}
          </div>
        )
      },
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
                })
              }
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

  const loadFollowRecord = async () => {
    const res = await getBusinessFollowRecord(projectId)
    setDataSource(res)
  }

  const download = (fileId: string, fileName: string) => {
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

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除跟进记录',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该跟进记录吗？数据删除后将无法恢复！',
      onOk() {
        deleteBusinessFollowRecord(id).then(() => {
          loadFollowRecord()
        })
      },
    })
  }

  const onEditOk = async (customerRow: BussinesFollowRecordType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addBusinessFollowRecord({
          ...customerRow,
          projectId: projectId,
        })
      } else {
        // 编辑数据
        await updateBusinessFollowRecord({
          ...customerRow,
          projectId: projectId,
        })
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ ...params, visible: false, currentRow: null })
      loadFollowRecord()
    } catch (error) {}
  }

  return (
    <>
      <AddFollowRecord
        params={params}
        onCancel={() =>
          setParams({ ...params, visible: false, currentRow: null })
        }
        onOk={onEditOk}
      />
      {projectId && (
        <Table
          scroll={{ x: 'max-content', y: 108 }}
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          dataSource={dataSource}
        />
      )}
    </>
  )
}

export default FollowRecord
