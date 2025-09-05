import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Space, Table, TableProps, Tabs, TabsProps } from 'antd'
import SuccessIcon from '@/assets/svg/icon/success.svg'
import { getMyEnquiryManageDetail } from '@/services/myEnquiry/myEnquiryApi'
import type { EnquiryHallItemType } from '@/services/enquiryHall/enquiryHallModel'
import type { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { formatTime } from '@/utils/format'

export type MyEnquiryDetailProps = {
  params: {
    visible: boolean
    currentRow: { id: string } | null
  }
  onCancel: () => void
}

const MyEnquiryDetail: React.FC<MyEnquiryDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('BaseInfoCom')

  const [enquiryDrawerInfo, setEnquiryDrawerInfo] = useState<{
    detail: EnquiryHallItemType | null
  }>({
    detail: null,
  })

  useEffect(() => {
    if (!visible) return
    loadMyEnquiryDetail()
  }, [visible])

  const loadMyEnquiryDetail = async () => {
    const resp = await getMyEnquiryManageDetail(currentRow?.id as string)
    setEnquiryDrawerInfo({
      detail: resp,
    })
  }

  const baseInfo = useCallback(() => {
    return [
      {
        label: '询价标题：',
        value: enquiryDrawerInfo.detail?.title,
      },
      {
        label: '预估金额：',
        value: enquiryDrawerInfo.detail?.estimatedAmount,
      },
      {
        label: '城市/区县：',
        value: enquiryDrawerInfo.detail?.address,
      },
      {
        label: '截止报价日期：',
        value: formatTime(
          enquiryDrawerInfo.detail?.deadline as string,
          'Y-M-D'
        ),
      },
      {
        label: '询价创建日期：',
        value: enquiryDrawerInfo.detail?.createTime,
      },
      {
        label: '简要说明：',
        value: enquiryDrawerInfo.detail?.remark ?? '无',
      },
    ]
  }, [enquiryDrawerInfo])

  const onChange = (value: string) => {
    setDefaultActiveKey(value)
  }

  const MyQuotationDetailTableColumns: TableProps['columns'] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '型号-电压等级-规格',
      key: 'productName',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '单位',
      key: 'productUnit',
      dataIndex: 'productUnit',
      align: 'center',
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
    },
    {
      title: '产品单价',
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
    },
  ]

  const CustomerEnquiryDetailTableColumns: TableProps['columns'] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '产品名称',
      key: 'productName',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '单位',
      key: 'productUnit',
      dataIndex: 'productUnit',
      align: 'center',
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
    },
  ]

  const getSum = useMemo(() => {
    const value = (enquiryDrawerInfo.detail?.quotations ?? []).reduce(
      (total: number, item: BussinesEnquiryProductType) => {
        return total + Number(item.amount)
      },
      0
    )
    return value.toFixed(1)
  }, [enquiryDrawerInfo])

  const MyQuotationDetail: React.FC = () => {
    return (
      <>
        {enquiryDrawerInfo.detail?.confirmQuotationId && (
          <div
            className="px-[12px] mx-[20px] py-[9px] rounded-[6px] flex items-center text-green-500"
            style={{ background: '#F3FFED' }}
          >
            <img
              src={SuccessIcon}
              className="w-[16px] h-[16px] ml-[8px]"
              alt="success"
            />
            客户已选择该报价为备选供应商报价
          </div>
        )}
        <div
          className="h-[54px] leading-[54px] w-full mt-[8px] flex items-center px-[12px]"
          style={{ background: '#fafafa' }}
        >
          <span>报价总金额</span>
          <span className="text-red-500 mx-[20px]">{getSum}</span>
        </div>
        <Table<any>
          rowKey={'id'}
          size="small"
          columns={MyQuotationDetailTableColumns}
          dataSource={enquiryDrawerInfo.detail?.quotations ?? []}
          scroll={{ x: 'max-content', y: 398 }}
          pagination={false}
        />
      </>
    )
  }

  const CustomerEnquiryDetail: React.FC = () => {
    return (
      <>
        <Table<any>
          rowKey={'id'}
          size="small"
          columns={CustomerEnquiryDetailTableColumns}
          dataSource={enquiryDrawerInfo.detail?.products ?? []}
          scroll={{ x: 'max-content', y: 398 }}
          pagination={false}
        />
      </>
    )
  }

  const components: TabsProps['items'] = [
    {
      label: '我的报价明细',
      key: 'MyQuotationDetail',
      children: <MyQuotationDetail />,
    },
    {
      label: '客户询价明细',
      key: 'CustomerEnquiryDetail',
      children: <CustomerEnquiryDetail />,
    },
  ]

  return (
    <Drawer
      title="报价明细"
      width={912}
      open={visible}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <p className="font-semibold">客户询价基本信息</p>
      <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px] text-sm">
        {baseInfo().map((item) => (
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

export default MyEnquiryDetail
