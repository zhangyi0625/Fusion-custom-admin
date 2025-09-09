import React, { useCallback, useEffect, useState } from 'react'
import { Button, Drawer, Space, Table, TableProps, Tabs, TabsProps } from 'antd'
import type {
  OpenEnquiryType,
  QuotationsType,
} from '@/services/projectManage/OpenEnquiry/OpenEnquiryModel'
import { OpenEnquiryStatusOptions } from '../config'
import type { BaseInfoDetail } from '../BusinessEnquiry/BusinessEnquiryDrawer'
import { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { getOpenEnquiryListDetail } from '@/services/projectManage/OpenEnquiry/OpenEnquiryApi'
import OpenQuotationDetail from './OpenQuotationDetail'
import { formatTime } from '@/utils/format'
import { ProductManageType } from '@/services/productManage/productManageModel'

export type OpenEnquiryDetailProps = {
  params: {
    drawerShow: boolean
    detailId: string | null
  }
  onCancel: () => void
}

const OpenEnquiryDetail: React.FC<OpenEnquiryDetailProps> = ({
  params,
  onCancel,
}) => {
  const { drawerShow, detailId = '' } = params

  const [enquiryDrawerInfo, setEnquiryDrawerInfo] = useState<{
    detail: OpenEnquiryType | null
  }>({
    detail: null,
  })

  const [dataSource, setDataSource] = useState<BussinesEnquiryProductType[]>([])

  const [quotations, setQuotations] = useState<QuotationsType[]>([])

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('BaseInfoCom')

  const [quotationDetail, setQuotationDetail] = useState<{
    visible: boolean
    currentRow: { items: ProductManageType[] } | null
  }>({
    visible: false,
    currentRow: null,
  })

  const inventoryTableColumns: TableProps<BussinesEnquiryProductType>['columns'] =
    [
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
        title: '采购数量',
        key: 'qty',
        dataIndex: 'qty',
        align: 'center',
        width: 100,
      },
    ]

  const supplierQuotationTableColumns: TableProps<QuotationsType>['columns'] = [
    {
      title: '供应商',
      key: 'supplierName',
      dataIndex: 'supplierName',
      align: 'center',
      width: 140,
    },
    {
      title: '联系人',
      key: 'contactName',
      dataIndex: 'contactName',
      align: 'center',
      width: 100,
    },
    {
      title: '报价总金额',
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      width: 100,
    },
    {
      title: '报价时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '是否为备选供应商',
      key: 'alternative',
      align: 'center',
      width: 200,
      render(value) {
        return <div>{value.alternative ? '是' : '否'}</div>
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
                setQuotationDetail({ visible: true, currentRow: _ })
              }
              type="link"
            >
              报价明细
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    if (!drawerShow) return
    loadEnquiryDetail()
  }, [drawerShow])

  const loadEnquiryDetail = async () => {
    const resp = await getOpenEnquiryListDetail(detailId as string)
    console.log(resp, 'resp')
    setEnquiryDrawerInfo({ detail: resp })
    setDataSource(resp.products ?? [])
    setQuotations(resp.quotations ?? [])
  }

  const baseInfo = useCallback(() => {
    return [
      {
        label: '询价标题：',
        value: enquiryDrawerInfo.detail?.title,
      },
      {
        label: '预估金额(万元)：',
        value: enquiryDrawerInfo.detail?.estimatedAmount,
      },
      {
        label: '客户名称：',
        value: enquiryDrawerInfo.detail?.customerName,
      },
      {
        label: '状态：',
        className: `${
          enquiryDrawerInfo.detail?.status === 'PENDING_REVIEW'
            ? 'text-stone-900'
            : enquiryDrawerInfo.detail?.status === 'ENDED'
            ? 'text-red-500'
            : 'text-green-500'
        }`,
        value: OpenEnquiryStatusOptions.find(
          (item) => item.value === enquiryDrawerInfo.detail?.status
        )?.label,
      },
      {
        label: '手机号：',
        value: enquiryDrawerInfo.detail?.customerPhone,
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
  }, [enquiryDrawerInfo.detail])

  const tabsChange = (value: string) => {
    setDefaultActiveKey(value)
  }

  const BaseInfoCom: React.FC<{ detail: BaseInfoDetail[] }> = ({ detail }) => {
    return (
      <>
        <div className="grid grid-cols-2 text-gray-500 gap-y-[10px] mb-[30px]">
          {(detail || []).map((item) => (
            <p key={item.label}>
              {item.label}
              <span className={`${item.className} text-dull-grey`}>
                {item.value}
              </span>
            </p>
          ))}
        </div>
        <p className="font-semibold mt-[36px] mb-[12px]">询价清单</p>
        <Table<BussinesEnquiryProductType>
          bordered
          rowKey={'id'}
          size="small"
          columns={inventoryTableColumns}
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 188 }}
          pagination={false}
        />
      </>
    )
  }

  const SupplierQuotation: React.FC = () => {
    return (
      <>
        <Table<QuotationsType>
          bordered
          rowKey={'id'}
          size="small"
          columns={supplierQuotationTableColumns}
          dataSource={quotations}
          scroll={{ x: 'max-content', y: 588 }}
          pagination={false}
        />
      </>
    )
  }

  const components: TabsProps['items'] = [
    {
      label: '基本信息',
      key: 'BaseInfoCom',
      children: <BaseInfoCom detail={baseInfo() as BaseInfoDetail[]} />,
    },
    {
      label: '供应商报价',
      key: 'SupplierQuotation',
      children: <SupplierQuotation />,
    },
  ]

  return (
    <Drawer
      title="询价详情"
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
        onChange={tabsChange}
        key={detailId}
      />
      <OpenQuotationDetail
        params={quotationDetail}
        onCancel={() =>
          setQuotationDetail({ visible: false, currentRow: null })
        }
      />
    </Drawer>
  )
}

export default OpenEnquiryDetail
