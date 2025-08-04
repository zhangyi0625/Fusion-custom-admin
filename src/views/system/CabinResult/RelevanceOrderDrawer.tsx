import { memo, useEffect, useState } from 'react'
import { Drawer, Space, Button, TablePaginationConfig, TableProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import SearchTable from '@/components/searchTable'
import { getFastOrderOptions } from '@/services/order'
import type { OrderSearchParams } from '@/services/order/type'
import { formatTime } from '@/utils/format'
import SearchForm from '@/components/searchForm'
import { RelevanceOrderOptions } from './config'

type RelevanceOrderDrawerType = {
  drawerShow: boolean
  onOk: (e: string[]) => void
  onCancel: () => void
}

const RelevanceOrderDrawer: React.FC<RelevanceOrderDrawerType> = memo(
  (props) => {
    const { drawerShow, onOk, onCancel } = props

    const [selected, setSelected] = useState<string[]>([])

    const [immediate, setImmediate] = useState<boolean>(true)

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<OrderSearchParams>({
        pageIndex: 1,
        pageSize: 10,
        filter: {
          affiliateId: '',
        },
      })

    useEffect(() => {
      if (drawerShow) {
        setSearchDefaultForm({
          pageIndex: 1,
          pageSize: 10,
          filter: { affiliateId: '105' },
        })
        setImmediate(false)
      }
    }, [drawerShow])

    const columns: TableProps['columns'] = [
      {
        dataIndex: 'no',
        title: '订单号',
        key: 'no',
        align: 'center',
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
        title: '箱型/箱量/票',
        width: 250,
        align: 'center',
        render(text) {
          return (
            text.content?.items &&
            text.content?.items.map((item: any, index: number) => (
              <div key={index}>
                {item.containerType} * {item.containerQuantity}
                {item.orderNum ? (
                  <span className="mx-[8px]">{item.orderNum} 票</span>
                ) : null}
              </div>
            ))
          )
        },
      },
      {
        title: '价格上限',
        width: 250,
        align: 'center',
        render(text) {
          return (
            text.content?.items &&
            text.content?.items.map((item: any, index: number) => (
              <div key={index}>
                {item.containerType}
                {item.priceLimit.TOTAL && item.rose >= 0 ? (
                  <span>
                    $ {item.priceLimit.TOTAL['USD']}
                    <span className="mx-[10px]">
                      拍一手价,允许涨幅{item.rose}
                    </span>
                    <span></span>
                  </span>
                ) : item.rose === 0 && !item.priceLimit.TOTAL ? (
                  <span>一手价</span>
                ) : (
                  <span>拍一手价，允许涨幅{item.rose}</span>
                )}
              </div>
            ))
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
    ]

    const onUpdatePagination = (pagination: TablePaginationConfig) => {
      setSearchDefaultForm({
        ...searchDefaultForm,
        pageIndex: pagination.current as number,
        pageSize: pagination.pageSize as number,
      })
      setImmediate(false)
    }

    const onUpdateSearch = (
      info?: Pick<OrderSearchParams, 'filter'> | unknown
    ) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(([, value]) => !!value)
      )
      setSearchDefaultForm({
        ...searchDefaultForm,
        filter: {
          ...filteredObj,
          affiliateId: '105',
        },
      })
    }

    return (
      <Drawer
        title="关联订单"
        width={600}
        open={drawerShow}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        classNames={{ footer: 'text-right' }}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={() => onOk(selected)}>
              确定
            </Button>
          </Space>
        }
      >
        {drawerShow && (
          <SearchForm
            columns={RelevanceOrderOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            isShowReset={false}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        )}
        {drawerShow && (
          <SearchTable
            columns={columns}
            rowKey="id"
            fetchData={getFastOrderOptions}
            searchFilter={searchDefaultForm}
            isSelection={true}
            immediate={immediate}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelected(options)}
          />
        )}
      </Drawer>
    )
  }
)

export default RelevanceOrderDrawer
