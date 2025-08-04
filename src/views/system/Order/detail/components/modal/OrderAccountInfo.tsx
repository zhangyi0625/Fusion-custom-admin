import { memo } from 'react'
import DragModal from '@/components/modal/DragModal'
import { Table, TableProps } from 'antd'

type CarrierAccountsType = {
  name: string
  username: string
  affiliate: string
  password: string
  payPassword: string
}

interface OrderCarrierAccountsProps {
  params: {
    visible: boolean
    editRow: CarrierAccountsType[]
  }
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const OrderCarrierAccounts: React.FC<OrderCarrierAccountsProps> = memo(
  ({ params, onCancel }) => {
    const columns: TableProps['columns'] = [
      {
        dataIndex: 'name',
        title: '船司',
        key: 'name',
        align: 'center',
      },
      {
        dataIndex: 'username',
        title: '登录名',
        key: 'username',
        align: 'center',
      },
      {
        dataIndex: 'affiliate',
        title: '公司名称',
        key: 'affiliate',
        align: 'center',
      },
      {
        dataIndex: 'password',
        title: '登陆密码',
        key: 'password',
        align: 'center',
      },
      {
        dataIndex: 'payPassword',
        title: '支付密码',
        key: 'payPassword',
        align: 'center',
      },
    ]
    return (
      <DragModal
        title="订舱账号"
        width={'800px'}
        open={params.visible}
        onCancel={onCancel}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={params.editRow}
          pagination={false}
          rowKey="username"
        />
      </DragModal>
    )
  }
)

export default OrderCarrierAccounts
