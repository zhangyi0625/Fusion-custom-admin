import SearchTable from '@/components/searchTable'
import { getCabinManageList } from '@/services/cabinManage/cabinManageApi'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Space } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { getTemplateSetting } from './columns'

export type SetFrequecnyDrawerProps = {
  visible: boolean
  onOk: (params: string[]) => void
  onCancel: () => void
}

const SetFrequecnyDrawer: React.FC<SetFrequecnyDrawerProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  const [searchDefaultForm] = useState({
    startType: 'HIGH_FREQ',
  })

  const [seleced, setSelected] = useState<string[]>([])

  const tableColumns = useCallback(() => {
    let columns = getTemplateSetting()['columns']
    let nameKey = ['porCode', 'fndCode', 'route', 'etd']
    return columns?.filter((item) => nameKey.includes(String(item.key)))
  }, [])

  useEffect(() => {
    if (!visible) return
  }, [visible])

  return (
    <Drawer
      title="设置放舱同频"
      width={736}
      open={visible}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right', body: 'flex flex-col' }}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => onOk(seleced)}>
            确认
          </Button>
        </Space>
      }
    >
      <SearchTable
        size="middle"
        columns={tableColumns()}
        bordered
        selectionParentType="radio"
        rowKey="id"
        fetchData={getCabinManageList}
        searchFilter={searchDefaultForm}
        isSelection={true}
        isPagination={false}
        onUpdatePagination={() => {}}
        onUpdateSelection={(options: string[]) => setSelected(options)}
      />
    </Drawer>
  )
}

export default SetFrequecnyDrawer
