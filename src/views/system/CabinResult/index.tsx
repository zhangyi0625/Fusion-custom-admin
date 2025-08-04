import React from 'react'
import { useState } from 'react'
import { Button, Card, ConfigProvider, type TableProps, Space, App } from 'antd'
import { TablePaginationConfig } from 'antd/lib'
import { DownloadOutlined, SendOutlined } from '@ant-design/icons'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { CabinResultOptions } from './config'
import {
  postCabinResult,
  getCabinResultOptions,
  postOnRelevance,
  postRelevanceResult,
  postBatchProduct,
} from '@/services/order'
import type { OrderSearchParams } from '@/services/order/type'
import { formatTime } from '@/utils/format'
import CabinResultModal from './CabinResultModal'
import RelevanceOrderDrawer from './RelevanceOrderDrawer'
import ManualRelease from './ManualReleaseModal'

type CtnTypeParams = {
  ctnType: string
  count: number
}

const CabinResult: React.FC = () => {
  const { message } = App.useApp()

  const [searchDefaultForm, setSearchDefault] = useState<OrderSearchParams>({
    pageIndex: 1,
    pageSize: 10,
    filter: {},
  })

  const [params, setParams] = useState<{
    visible: boolean
    carrierOptions: { carrierCode: string }[]
  }>({ visible: false, carrierOptions: [] })

  const [loading, setLoading] = useState<boolean>(false)

  const [manualReleaseId, setManualReleaseId] = useState<string>('')

  const [selected, setSelected] = useState<string[]>([])

  const [relevance, setRelevance] = useState<boolean>(false)

  const [manualReleaseParams, setManualReleaseParmas] = useState<{
    visible: boolean
    editRow: any | null
    carrierOptions?: string[]
  }>({
    visible: false,
    editRow: null,
  })

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'affiliateName',
      title: '公司名称',
      key: 'affiliateName',
      align: 'center',
    },
    {
      dataIndex: 'carrier',
      title: '船公司',
      key: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'porName',
      title: '起运港名称',
      key: 'porName',
      align: 'center',
      width: 200,
    },
    {
      dataIndex: 'fndName',
      title: '目的港名称',
      key: 'fndName',
      align: 'center',
      width: 200,
    },
    {
      title: '关联状态',
      key: 'orderId',
      align: 'center',
      width: 100,
      render(text) {
        return <div>{text.orderId ? '已关联' : '未关联'}</div>
      },
    },
    {
      title: '发布状态',
      key: 'publishStatus',
      align: 'center',
      width: 100,
      render(text) {
        return (
          <div>
            {text.publishStatus == 1
              ? '已发布'
              : text.publishMsg
              ? '发布失败'
              : '未发布'}
          </div>
        )
      },
    },
    {
      dataIndex: 'bookingAccount',
      title: '订舱账号',
      key: 'bookingAccount',
      align: 'center',
    },
    {
      dataIndex: 'bookingNo',
      title: '订舱号',
      key: 'bookingNo',
      align: 'center',
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.etd, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '箱型/箱量/票',
      key: 'inventories',
      align: 'center',
      width: 150,
      render(text) {
        let ctnTypeArr: CtnTypeParams[] = []
        let value = JSON.parse(text.inventories ?? {})
        for (let i in value) {
          ctnTypeArr.push({
            ctnType: i,
            count: value[i],
          })
        }
        return ctnTypeArr.map((item, index) => (
          <div key={index}>
            {item.ctnType} * {item.count}
          </div>
        ))
      },
    },
    {
      title: '船名航次',
      key: 'vesselName',
      align: 'center',
      width: 180,
      render(text) {
        return (
          <div>
            {text.vesselName} / {text.voyNo}
          </div>
        )
      },
    },
    {
      title: '价格',
      key: 'price',
      align: 'center',
      width: 200,
      render(text) {
        let price = JSON.parse(text.price ?? {})
        return text.price ? (
          <div>
            Base:{price.bas?.value} / Total:{price.total?.value}
          </div>
        ) : (
          <div>-</div>
        )
      },
    },
    {
      title: '导入时间',
      key: 'created',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.created, 'Y-M-D h:m')}</div>
      },
    },
    {
      dataIndex: 'remark',
      title: '备注',
      key: 'remark',
      align: 'center',
    },
    {
      dataIndex: 'action',
      title: '操作',
      align: 'center',
      fixed: 'right',
      render(_, record) {
        return (
          <Space direction="vertical" size={0}>
            <div
              className={getClassName(!record.orderId, 'blue')}
              onClick={() => {
                setManualReleaseId(record.id)
                setRelevance(true)
              }}
            >
              关联订单
            </div>
            <div className={getClassName(record.orderId, 'red')}>查看订单</div>
            <div
              className={getClassName(record.orderId, 'blue')}
              onClick={() => cancelRelevance(record.id)}
            >
              取消关联
            </div>
            <div
              className={getClassName(!record.publishStatus, 'blue')}
              onClick={() => openManual(record)}
            >
              手动发布
            </div>
          </Space>
        )
      },
    },
  ]

  const getClassName = (status: boolean, color: string) => {
    return status ? `cursor-pointer text-${color}-500` : 'hidden'
  }

  const onUpdateSearch = (
    info?: Pick<OrderSearchParams, 'filter'> | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    setSearchDefault({
      ...searchDefaultForm,
      filter: {
        ...filteredObj,
      },
    })
  }

  const batchIssue = () => {
    if (selected.length === 0) {
      message.error('请至少选择一条要导出的订单')
      return
    }
    setLoading(true)
    postBatchProduct(selected)
      .then((res) => {
        let flag =
          res.data.effected == selected.length &&
          !res.data.failedItems &&
          res.data.failedItems.length !== 0
            ? true
            : false
        let errorMsg = res.data.failedItems[0].message ?? ''
        flag === true
          ? message.success('批量发布成功')
          : message.error(
              `发布成功${res.data.effected}条数据，其余发布失败，失败原因：${errorMsg}等...`
            )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const onEditOk = (params: any) => {
    postCabinResult(params)
      .then((res) => {
        message.success('导入成功！')
      })
      .catch((Error) => {
        console.log(Error, 'error')
      })
  }

  const onCancel = () => {
    setParams({ visible: false, carrierOptions: [] })
  }

  const openCabinResultModal = () => {
    setParams({
      visible: true,
      carrierOptions:
        (CabinResultOptions.find((item) => item.name === 'carrier')
          ?.options as { carrierCode: string }[]) || [],
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefault({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
  }

  const cancelRelevance = (id: string) => {
    postOnRelevance({ ids: [id] }).then(() => {
      message.success('操作成功')
    })
  }

  const handleOk = (e: string[]) => {
    if (e.length !== 1) message.error('只能选择一条订单导入订舱结果')
    else {
      postRelevanceResult({
        ids: [manualReleaseId],
        orderId: e.join(','),
      }).then(() => {
        message.success('导入成功')
        setRelevance(false)
      })
      // onUpdateSearch()
    }
  }

  const openManual = (row: any) => {
    let arr = CabinResultOptions.find(
      (item) => item.name === 'carrier'
    )?.options
    setManualReleaseParmas({
      visible: true,
      editRow: row,
      carrierOptions: arr?.map((item) => item.name),
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
            columns={CabinResultOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
            isShowExpend={false}
            isShowReset={true}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
        <Card>
          <Space className="mb-[20px]">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={openCabinResultModal}
            >
              导入拍舱结果
            </Button>
            <Button
              type="primary"
              style={{ background: '#FA8C16' }}
              icon={<SendOutlined />}
              loading={loading}
              onClick={batchIssue}
            >
              批量发布
            </Button>
          </Space>
          <SearchTable
            columns={columns}
            rowKey="id"
            fetchData={getCabinResultOptions}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelected(options)}
          />
        </Card>
      </ConfigProvider>
      <CabinResultModal params={params} onOk={onEditOk} onCancel={onCancel} />
      <RelevanceOrderDrawer
        drawerShow={relevance}
        onCancel={() => setRelevance(false)}
        onOk={handleOk}
      />
      <ManualRelease
        params={manualReleaseParams}
        onCancel={() =>
          setManualReleaseParmas({ visible: false, editRow: null })
        }
        onOk={() => {}}
      />
    </>
  )
}

export default CabinResult
