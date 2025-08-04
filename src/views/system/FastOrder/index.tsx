import { useState } from 'react'
import type React from 'react'
import { Button, Card, ConfigProvider, type TableProps, Space, App } from 'antd'
import { TablePaginationConfig } from 'antd/lib'
import { DownloadOutlined } from '@ant-design/icons'
import SearchForm, { CustomColumn } from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { SelectFastOrderOptions } from './config'
import {
  getFastOrderOptions,
  downFastOrder,
  downOrderResult,
} from '@/services/order'
import type { OrderSearchParams } from '@/services/order/type'
import { formatTime } from '@/utils/format'

const FastOrder: React.FC = () => {
  const { message } = App.useApp()

  const [searchDefaultForm, setSearchDefault] = useState<OrderSearchParams>({
    pageIndex: 1,
    pageSize: 10,
    filter: {
      genres: 'FASTBOOKING',
    },
  })

  const [selected, setSelected] = useState<string[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  const OrderColumns: TableProps['columns'] = [
    {
      dataIndex: 'no',
      title: '订单号',
      key: 'no',
      align: 'center',
    },
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      key: 'affiliateName',
      align: 'center',
    },
    {
      dataIndex: 'customerName',
      title: '用户名',
      key: 'customerName',
      align: 'center',
    },
    {
      title: '订单状态',
      key: 'status',
      align: 'center',
      width: 100,
      render(text) {
        let options =
          SelectFastOrderOptions.find(
            (item: CustomColumn) => item.name === 'status'
          )?.options ?? []
        return (
          <div>
            {options.filter((item: any) => item.id === text.status)[0].name}
          </div>
        )
      },
    },
    {
      title: '船公司',
      key: 'carrier',
      align: 'center',
      width: 80,
      render(text) {
        return <div>{text.content.carrier[0]}</div>
      },
    },
    {
      title: '起运港名称',
      key: 'por',
      align: 'center',
      width: 200,
      render(text) {
        return (
          <div>
            <p>{text.content?.por?.localName ?? '-'}</p>
            <p>{text.content?.por?.name ?? '-'}</p>
          </div>
        )
      },
    },
    {
      title: '目的港名称',
      key: 'fnd',
      align: 'center',
      width: 200,
      render(text) {
        return (
          <div>
            <p>{text.content?.fnd?.localName ?? '-'}</p>
            <p>{text.content?.fnd?.name ?? '-'}</p>
          </div>
        )
      },
    },
    {
      title: '开航起止日期',
      key: 'createTime',
      align: 'center',
      render(text) {
        return (
          <div>
            {formatTime(text.content?.etdStart, 'M-D')} 至
            {formatTime(text.content?.etdEnd, 'M-D')}
          </div>
        )
      },
    },
    {
      title: '订单修改时间',
      key: 'updated',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.updated, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '箱型/箱量/票',
      width: 250,
      align: 'center',
      render(text) {
        return text.content?.items.map((item: any, index: number) => (
          <div key={index}>
            {item.containerType} * {item.containerQuantity}
            {item.orderNum ? (
              <span className="mx-[8px]">{item.orderNum} 票</span>
            ) : null}
          </div>
        ))
      },
    },
    {
      title: '价格上限',
      width: 250,
      align: 'center',
      render(text) {
        return text.content?.items.map((item: any, index: number) => (
          <div key={index}>
            {item.containerType}
            {item.priceLimit.TOTAL && item.rose >= 0 ? (
              <span>
                $ {item.priceLimit.TOTAL['USD']}
                <span className="mx-[10px]">拍一手价,允许涨幅{item.rose}</span>
                <span></span>
              </span>
            ) : item.rose === 0 && !item.priceLimit.TOTAL ? (
              <span>一手价</span>
            ) : (
              <span>拍一手价，允许涨幅{item.rose}</span>
            )}
          </div>
        ))
      },
    },
    {
      dataIndex: 'deadline',
      title: '预计放舱时间',
      key: 'deadline',
      align: 'center',
    },
    {
      title: '订舱通道',
      align: 'center',
      width: 120,
      render(text) {
        return (
          <div>
            {text.status === 'PENDING'
              ? '-'
              : text.api
              ? 'API极虎'
              : '自有订舱'}
          </div>
        )
      },
    },
    {
      title: '备注',
      key: 'remark',
      width: 130,
      align: 'center',
      render(text) {
        return <div>{text.content?.remark}</div>
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <Space size={0}>
            <Button size="middle" onClick={() => openDetail(record)}>
              查看
            </Button>
          </Space>
        )
      },
    },
  ]

  const onUpdateSearch = (
    info: Pick<OrderSearchParams, 'filter'> | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    setSearchDefault({
      ...searchDefaultForm,
      filter: {
        ...filteredObj,
        genres: 'FASTBOOKING',
      },
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefault({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  const openDetail = (detail: unknown) => {
    console.log(detail, 'detail')
  }

  const exportTableData = (type: string) => {
    if (selected.length === 0) {
      message.error('请至少选择一条要导出的订单')
      return
    }
    setLoading(true)
    ;(type === 'table'
      ? downFastOrder({ ids: selected.join(',') })
      : downOrderResult({ ids: selected.join(',') })
    )
      .then((res) => {
        const content = res.data
        const blob = new Blob([content], {
          type: 'application/vnd.ms-excel',
        })
        const elink = document.createElement('a')
        elink.download = `(${type} !== 'table' ? 拍舱结果 : '光速预定列表').xlsx`
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card>
          <SearchForm
            columns={SelectFastOrderOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card>
        <Space className="mb-[20px]">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading}
            onClick={() => exportTableData('table')}
          >
            导出列表
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading}
            onClick={() => exportTableData('result')}
          >
            导出订单结果
          </Button>
        </Space>
        <SearchTable
          columns={OrderColumns}
          rowKey="id"
          fetchData={getFastOrderOptions}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelected(options)}
        />
      </Card>
    </>
  )
}

export default FastOrder
