import { Button, Drawer, Space, Table, Tabs } from 'antd'
import React, { Component, useEffect } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import BaseInfoCom from './Component/BaseInfo'
import EnquiryProductCom from './Component/enquiryProduct'
import EnquiryRecordCom from './Component/enquiryRecord'
import OperationRecordCom from './Component/operationRecord'
import SupplierInfoCom from './Component/supplierInfo'

export type BusinessEnquiryDrawerProps = {
  drawer: {
    drawerShow: boolean
    detailId: string | null
  }

  onCancel: () => void
}

const components = [
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
    children: <SupplierInfoCom />,
  },
  {
    label: '询价记录',
    key: 'EnquiryRecordCom',
    children: <EnquiryRecordCom />,
  },
  {
    label: '操作记录',
    key: 'OperationRecordCom',
    children: <OperationRecordCom />,
  },
]

const BusinessEnquiryDrawer: React.FC<BusinessEnquiryDrawerProps> = ({
  drawer,
  onCancel,
}) => {
  const { drawerShow, detailId } = drawer

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
