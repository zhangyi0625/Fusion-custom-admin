import React, { useCallback, useEffect, useState } from 'react'
import { Button, Drawer, Space, Table } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { getTemplateSetting } from './columns'
import { getCabinOperationLog } from '@/services/cabinManage/cabinManageApi'

export type OperationLogDrawerProps = {
  params: {
    visible: boolean
    id: string | null
  }
  onCancel: () => void
}

const OperationLogDrawer: React.FC<OperationLogDrawerProps> = ({
  params,
  onCancel,
}) => {
  const { visible, id } = params

  const [tableData, setTableData] = useState([])

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return
    loadOperationLog()
  }, [visible])

  const tableColumns = useCallback(() => {
    return getTemplateSetting()['operationColumns']
  }, [])

  const loadOperationLog = () => {
    setLoading(true)
    getCabinOperationLog(id ?? '')
      .then((resp) => {
        setTableData(resp)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }
  return (
    <Drawer
      title="操作日志"
      width={700}
      open={visible}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      loading={loading}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <Table
        size="middle"
        bordered
        pagination={false}
        dataSource={tableData}
        columns={tableColumns()}
        loading={loading}
        rowKey="id"
      />
    </Drawer>
  )
}

export default OperationLogDrawer
