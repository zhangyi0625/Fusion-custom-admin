import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Space, Table, TableProps, Tabs, TabsProps } from 'antd'
import SuccessIcon from '@/assets/svg/icon/success.svg'
import { getMyEnquiryManageDetail } from '@/services/myEnquiry/myEnquiryApi'
import type { EnquiryHallItemType } from '@/services/enquiryHall/enquiryHallModel'
import { getEnquiryManageDetail } from '@/services/enquiryHall/enquiryHallApi'
import type { ProductManageType } from '@/services/productManage/productManageModel'
import { formatTime } from '@/utils/format'

export type MyEnquiryDetailProps = {
  params: {
    visible: boolean
    currentRow: { id: string; inquiryId: string } | null
    type: string
  }
  onCancel: () => void
}

const MyEnquiryDetail: React.FC<MyEnquiryDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow, type } = params

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('MyQuotationDetail')

  const [enquiryDrawerInfo, setEnquiryDrawerInfo] = useState<{
    enquiryDetail: EnquiryHallItemType | null
    quotationDetil: { supplierName: string; items: ProductManageType[] } | null
  }>({
    quotationDetil: null,
    enquiryDetail: null,
  })

  useEffect(() => {
    if (!visible) return
    loadMyEnquiryDetail()
    setDefaultActiveKey(type)
  }, [visible])

  const loadMyEnquiryDetail = async () => {
    const resp = await getMyEnquiryManageDetail(currentRow?.id as string)
    const enquiryInfo = await getEnquiryManageDetail(
      currentRow?.inquiryId as string
    )
    setEnquiryDrawerInfo({
      enquiryDetail: enquiryInfo,
      quotationDetil: resp,
    })
  }

  const baseInfo = useCallback(() => {
    return [
      {
        label: '询价标题：',
        value: enquiryDrawerInfo.enquiryDetail?.title,
      },
      {
        label: '预估金额(万元)：',
        value: enquiryDrawerInfo.enquiryDetail?.estimatedAmount,
      },
      {
        label: '城市/区县：',
        value: enquiryDrawerInfo.enquiryDetail?.address,
      },
      {
        label: '截止报价日期：',
        value: formatTime(
          enquiryDrawerInfo.enquiryDetail?.deadline as string,
          'Y-M-D'
        ),
      },
      {
        label: '询价创建日期：',
        value: enquiryDrawerInfo.enquiryDetail?.createTime,
      },
      {
        label: '简要说明：',
        value: enquiryDrawerInfo.enquiryDetail?.remark ?? '无',
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
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
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
    const value = (enquiryDrawerInfo.quotationDetil?.items ?? []).reduce(
      (total: number, item: ProductManageType) => {
        return total + Number(item.amount) * Number(item.qty)
      },
      0
    )
    return value.toFixed(1)
  }, [enquiryDrawerInfo])

  const MyQuotationDetail: React.FC = () => {
    return (
      <>
        {enquiryDrawerInfo.enquiryDetail?.confirmQuotationId && (
          <div
            className="px-[12px] my-[20px] py-[9px] rounded-[6px] flex items-center text-green-500"
            style={{ background: '#F3FFED' }}
          >
            <img
              src={SuccessIcon}
              className="w-[16px] h-[16px] mr-[6px]"
              alt="success"
            />
            客户已选择该报价为备选供应商报价
          </div>
        )}
        <div
          className="h-[54px] leading-[54px] w-full mt-[8px] flex items-center justify-end px-[12px]"
          style={{ background: '#fafafa' }}
        >
          <span>报价总金额</span>
          <span className="text-red-500 mx-[20px]">{getSum}</span>
        </div>
        <div className="editable-row">
          <Table
            rowKey={'id'}
            size="small"
            columns={MyQuotationDetailTableColumns}
            dataSource={enquiryDrawerInfo.quotationDetil?.items ?? []}
            scroll={{ x: 'max-content', y: 398 }}
            pagination={false}
          />
        </div>
      </>
    )
  }

  const CustomerEnquiryDetail: React.FC = () => {
    return (
      <>
        <Table
          rowKey={'id'}
          size="small"
          columns={CustomerEnquiryDetailTableColumns}
          dataSource={enquiryDrawerInfo.enquiryDetail?.products ?? []}
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
      <p className="font-semibold mb-[20px]">客户询价基本信息</p>
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
