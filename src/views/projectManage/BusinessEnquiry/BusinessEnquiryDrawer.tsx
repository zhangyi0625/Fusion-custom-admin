import '../index.scss'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Space, Tabs, TabsProps } from 'antd'
import BaseInfoCom from './Component/BaseInfo'
import EnquiryProductCom from './Component/EnquiryProduct'
import EnquiryRecordCom from './Component/EnquiryRecord'
import OperationRecordCom from './Component/OperationRecord'
import SupplierInfoCom from './Component/SupplierInfo'
import SalesContract from '../SaleProject/Component/SalesContract'
import FollowRecord from '../SaleProject/Component/FollowRecord'
import PurchaseNegotiation from '../PurchaseBargain/Component/PurchaseNegotiation'
import { getBusinessEnquiryDetail } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { ProjectStatusOptions } from '../config'

export type BusinessEnquiryDrawerProps = {
  drawer: {
    drawerShow: boolean
    detailId: string | null
    source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
  }
  onCancel: () => void
}

export type BaseInfoDetail = {
  label: string
  value: string
  className?: string
}

const BusinessEnquiryDrawer: React.FC<BusinessEnquiryDrawerProps> = ({
  drawer,
  onCancel,
}) => {
  const { drawerShow, detailId } = drawer

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('BaseInfoCom')

  const projectId = useMemo(() => {
    return !drawerShow ? '' : detailId
  }, [drawerShow])

  const [enquiryDrawerInfo, setEnquiryDrawerInfo] = useState<{
    detail: BusinessEnquiryType | null
  }>({
    detail: null,
  })

  useEffect(() => {
    if (!drawerShow) return
    loadEnquiryDetail()
    console.log(defaultActiveKey, 'defaultActiveKey')
  }, [drawerShow])

  const loadEnquiryDetail = () => {
    getBusinessEnquiryDetail(detailId as string).then((resp) => {
      setEnquiryDrawerInfo({ ...enquiryDrawerInfo, detail: resp })
    })
  }

  const baseInfo = useCallback(() => {
    return [
      {
        label: '项目编号：',
        value: enquiryDrawerInfo.detail?.number,
      },
      {
        label: '项目名称：',
        value: enquiryDrawerInfo.detail?.name,
      },
      {
        label: '客户名称：',
        value: enquiryDrawerInfo.detail?.customerName,
      },
      {
        label: '状态：',
        className: `${
          enquiryDrawerInfo.detail?.status === 'PENDING_PURCHASE'
            ? 'text-dull-grey'
            : enquiryDrawerInfo.detail?.status === 'TERMINATED'
            ? 'text-red-500'
            : 'text-green-500'
        }`,
        value: ProjectStatusOptions.find(
          (item) => item.value === enquiryDrawerInfo.detail?.status
        )?.text,
      },
      {
        label: '付款方：',
        value: enquiryDrawerInfo.detail?.companyName,
      },
      {
        label: '预计采购日期：',
        value: enquiryDrawerInfo.detail?.estimatedPurchaseTime,
      },
      {
        label: '项目类型：',
        value:
          enquiryDrawerInfo.detail?.type === 'FRAME_CONTRACT'
            ? '框架合同'
            : '即期合同',
      },
      {
        label: '金额：',
        value: enquiryDrawerInfo.detail?.price,
      },
      {
        label: '备注：',
        value: enquiryDrawerInfo.detail?.remark,
      },
      {
        label: '我司签约：',
        value: enquiryDrawerInfo.detail?.entrustName,
      },
      {
        label: '创建者：',
        value: enquiryDrawerInfo.detail?.createName,
      },
      {
        label: '创建时间：',
        value: enquiryDrawerInfo.detail?.createTime,
      },
    ]
  }, [enquiryDrawerInfo.detail])

  const components: TabsProps['items'] = [
    {
      label: '基本信息',
      key: 'BaseInfoCom',
      children: (
        <BaseInfoCom detail={baseInfo() as unknown as BaseInfoDetail[]} />
      ),
    },
    {
      label: '采购议价',
      key: 'PurchaseNegotiation',
      children: <PurchaseNegotiation />,
      disabled:
        drawer.source === 'SaleProject' || drawer.source === 'BusinessEnquiry',
    },
    {
      label: '询价产品',
      key: 'EnquiryProductCom',
      children: <EnquiryProductCom projectId={detailId as string} />,
      disabled: drawer.source === 'PurchaseBargain',
    },
    {
      label: '供应商',
      key: 'SupplierInfoCom',
      children: (
        <SupplierInfoCom
          detail={enquiryDrawerInfo.detail as BusinessEnquiryType}
          source={drawer.source}
          projectId={detailId as string}
          onFreshDetail={() => loadEnquiryDetail()}
        />
      ),
      disabled: drawer.source === 'PurchaseBargain',
    },
    {
      label:
        drawer.source === 'BusinessEnquiry'
          ? '询价记录'
          : drawer.source === 'SaleProject'
          ? '询报价记录'
          : '议价记录',
      key: 'EnquiryRecordCom',
      children: (
        <EnquiryRecordCom
          source={drawer.source}
          projectId={detailId as string}
        />
      ),
    },
    {
      label: drawer.source === 'SaleProject' ? '销售合同' : '采购合同',
      key: 'SalesContract',
      children: (
        <SalesContract
          projectId={detailId as string}
          detail={enquiryDrawerInfo.detail as BusinessEnquiryType}
        />
      ),
      disabled: drawer.source === 'BusinessEnquiry',
    },
    {
      label: '跟进记录',
      key: 'FollowRecord',
      children: <FollowRecord projectId={detailId as string} />,
      disabled:
        drawer.source === 'BusinessEnquiry' ||
        drawer.source === 'PurchaseBargain',
    },
    {
      label: '操作记录',
      key: 'OperationRecordCom',
      children: <OperationRecordCom projectId={detailId as string} />,
    },
  ]

  const onChange = (value: string) => {
    setDefaultActiveKey(value)
  }

  const onClose = () => {
    // setDefaultActiveKey('BaseInfoCom')
    onCancel()
  }

  return (
    <Drawer
      title="项目详情"
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
              <span className={`${item.className} text-dull-grey`}>
                {item.value}
              </span>
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

export default BusinessEnquiryDrawer
