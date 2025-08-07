import React, { useEffect } from 'react'
import { Button, Drawer, Space, Tabs, TabsProps } from 'antd'
import BaseInfoCom from './Component/BaseInfo'
import EnquiryProductCom from './Component/EnquiryProduct'
import EnquiryRecordCom from './Component/EnquiryRecord'
import OperationRecordCom from './Component/OperationRecord'
import SupplierInfoCom from './Component/SupplierInfo'
import SalesContract from '../SaleProject/Component/SalesContract'
import FollowRecord from '../SaleProject/Component/FollowRecord'

export type BusinessEnquiryDrawerProps = {
  drawer: {
    drawerShow: boolean
    detailId: string | null
    source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
  }
  onCancel: () => void
}

const BusinessEnquiryDrawer: React.FC<BusinessEnquiryDrawerProps> = ({
  drawer,
  onCancel,
}) => {
  const { drawerShow, detailId } = drawer

  const components: TabsProps['items'] = [
    {
      label: '基本信息',
      key: 'BaseInfoCom',
      children: <BaseInfoCom />,
    },
    {
      label: '询价产品',
      key: 'EnquiryProductCom',
      children: <EnquiryProductCom />,
    },
    {
      label: '供应商',
      key: 'SupplierInfoCom',
      children: <SupplierInfoCom source={drawer.source} />,
    },
    {
      label: drawer.source === 'BusinessEnquiry' ? '询价记录' : '询报价记录',
      key: 'EnquiryRecordCom',
      children: <EnquiryRecordCom />,
    },
    {
      label: '销售合同',
      key: 'SalesContract',
      children: <SalesContract />,
      disabled: drawer.source === 'BusinessEnquiry',
    },
    {
      label: '跟进记录',
      key: 'FollowRecord',
      children: <FollowRecord />,
      disabled: drawer.source === 'BusinessEnquiry',
    },
    {
      label: '操作记录',
      key: 'OperationRecordCom',
      children: <OperationRecordCom />,
    },
  ]

  useEffect(() => {
    if (!drawerShow) return
    // if (!currentRow) form.resetFields()
  }, [drawerShow])

  return (
    <Drawer
      title="项目详情"
      width={912}
      open={drawerShow}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px] text-sm">
        <p>项目编号：</p>
        <p>项目名称：</p>
        <p>客户名称：</p>
        <p>状态：</p>
      </div>
      <Tabs
        defaultActiveKey="BaseInfoCom"
        items={components as any}
        // onChange={onChange}
      />
    </Drawer>
  )
}

export default BusinessEnquiryDrawer
