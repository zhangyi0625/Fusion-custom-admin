import React, { useCallback, useEffect, useState } from 'react'
import { Button, Drawer, Space, Table, TableProps, Tabs, TabsProps } from 'antd'
import type { OpenEnquiryType } from '@/services/projectManage/OpenEnquiry/OpenEnquiryModel'
import { ProjectStatusOptions } from '../config'
import type { BaseInfoDetail } from '../BusinessEnquiry/BusinessEnquiryDrawer'
import { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { SearchTable } from 'customer-search-form-table'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'

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

  const [immediate, setImmediate] = useState<boolean>(true)

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('BaseInfoCom')

  const [quotationDetail, setQuotationDetail] = useState<{
    visible: boolean
    currentRow: null
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
      },
    ]

  const supplierQuotationTableColumns: TableProps['columns'] = [
    {
      title: '供应商',
      key: 'supplierName',
      dataIndex: 'supplierName',
      align: 'center',
      width: 120,
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
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: 100,
    },
    {
      title: '报价时间',
      key: 'Timeline',
      dataIndex: 'Timeline',
      align: 'center',
      width: 100,
    },
    {
      title: '是否为备选供应商',
      key: 'is',
      dataIndex: 'is',
      align: 'center',
      width: 100,
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
  }, [drawerShow])

  const baseInfo = useCallback(() => {
    return [
      {
        label: '询价标题：',
        value: enquiryDrawerInfo.detail?.title,
      },
      {
        label: '预估金额：',
        value: enquiryDrawerInfo.detail?.price,
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
        label: '手机号：',
        value: enquiryDrawerInfo.detail?.phone,
      },
      {
        label: '城市/区县：',
        value: enquiryDrawerInfo.detail?.city,
      },
      {
        label: '截止报价日期：',
        value: enquiryDrawerInfo.detail?.deadTime,
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
    // if (value === 'EnquiryRecordCom') {
    //   EnquiryRecordComRef.current?.onRefresh()
    // } else if (value === 'OperationRecordCom') {
    //   OperationRecordComRef.current?.onRefresh()
    // }
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
        <SearchTable
          size="middle"
          columns={supplierQuotationTableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          immediate={immediate}
          scroll={{ x: 'max-content', y: 578 }}
          fetchData={getBusinessEnquiryListPage}
          searchFilter={{}}
          isSelection={false}
          isPagination={false}
          onUpdatePagination={() => {}}
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
      />
    </Drawer>
  )
}

export default OpenEnquiryDetail
