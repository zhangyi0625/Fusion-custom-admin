import React, { useCallback, useEffect, useState } from 'react'
import { Button, Drawer, Space, Tabs, TabsProps } from 'antd'
import { getContractManageDetail } from '@/services/contractManage/SalesContract/SalesContractApi'
import { AddSalesContractForm } from '../config'
import SalesContractDetail from './Component/SalesContractDetail'
import SalesContractAttachment from './Component/SalesContractAttachment'
import SalesContractNote from './Component/SalesContractNote'
import type { SaleContractType } from '@/services/contractManage/SalesContract/SalesContractModel'

export type SalesContractDrawerProps = {
  drawer: {
    drawerShow: boolean
    detailId: string | null
    source: 'SalesContract' | 'PurchaseContract'
  }
  onCancel: () => void
}

export type BaseInfoDetail = {
  label: string
  value: string
  className?: string
}

const SalesContractDrawer: React.FC<SalesContractDrawerProps> = ({
  drawer,
  onCancel,
}) => {
  const { drawerShow, detailId } = drawer

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>(
    'SalesContractDetail'
  )

  const [enquiryDrawerInfo, setEnquiryDrawerInfo] =
    useState<SaleContractType | null>(null)

  useEffect(() => {
    if (!drawerShow) return
    loadEnquiryDetail()
    console.log(defaultActiveKey, 'defaultActiveKey')
  }, [drawerShow])

  const loadEnquiryDetail = () => {
    getContractManageDetail(detailId as string).then((resp) => {
      setEnquiryDrawerInfo(resp)
    })
  }

  const baseInfo = useCallback(() => {
    let options = AddSalesContractForm.find(
      (item) => item.name === 'status'
    )?.options
    return [
      {
        label: '合同编号：',
        value: enquiryDrawerInfo?.number,
      },
      {
        label: '合同名称：',
        value: enquiryDrawerInfo?.name,
      },
      {
        label: '合同类型：',
        value:
          enquiryDrawerInfo?.type === 'FRAMEWORK' ? '框架合同' : '即期合同',
      },
      {
        label: '状态：',
        value: options?.find((item) => item.value === enquiryDrawerInfo?.status)
          ?.label,
      },
      {
        label: '客户名称：',
        value: enquiryDrawerInfo?.customerName,
      },
      {
        label: '客户付款方：',
        value: enquiryDrawerInfo?.companyName,
      },
      {
        label: '项目名称：',
        value: enquiryDrawerInfo?.projectName,
      },
      {
        label: '项目编号：',
        value: enquiryDrawerInfo?.projectName,
      },
      {
        label: '金额：',
        value: enquiryDrawerInfo?.price,
      },
      {
        label: '合同日期：',
        value: enquiryDrawerInfo?.contractTime,
      },
      {
        label: '业务员：',
        value: enquiryDrawerInfo?.salespersonName,
      },
      {
        label: '创建者：',
        value: enquiryDrawerInfo?.createName,
      },
      {
        label: '创建时间：',
        value: enquiryDrawerInfo?.createTime,
      },
      {
        label: '更新者：',
        value: enquiryDrawerInfo?.updateName,
      },
      {
        label: '更新时间：',
        value: enquiryDrawerInfo?.updateTime,
      },
    ]
  }, [enquiryDrawerInfo])

  const components: TabsProps['items'] = [
    {
      label: '合同详情',
      key: 'SalesContractDetail',
      children: (
        <SalesContractDetail
          detail={baseInfo() as unknown as BaseInfoDetail[]}
        />
      ),
    },
    {
      label: '合同附件',
      key: 'SalesContractAttachment',
      children: <SalesContractAttachment detailId={detailId as string} />,
    },
    {
      label: '款项登记',
      key: 'SalesContractNote',
      children: <SalesContractNote detailId={detailId as string} />,
    },
  ]

  const onChange = (value: string) => {
    setDefaultActiveKey(value)
  }

  const onClose = () => {
    onCancel()
  }

  return (
    <Drawer
      title="合同详情"
      width={912}
      open={drawerShow}
      onClose={onClose}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
        </Space>
      }
    >
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px] text-sm">
        {baseInfo()
          .slice(0, 4)
          .map((item) => (
            <p key={item.label}>
              {item.label}
              <span className="text-dull-grey">{item.value}</span>
            </p>
          ))}
      </div>
      <Tabs
        activeKey={defaultActiveKey}
        items={components}
        onChange={onChange}
      />
    </Drawer>
  )
}

export default SalesContractDrawer
