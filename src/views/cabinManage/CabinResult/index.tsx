import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, ConfigProvider, Space, TableProps } from 'antd'
import { RootState, setEssentail } from '@/stores/store'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel'
import type { CabinResultParams } from '@/services/cabinManage/cabinManageModel'
import { getCabinResultList } from '@/services/cabinManage/cabinManageApi'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import { SelectCabinResultOptions } from './config'
import { ExportOutlined } from '@ant-design/icons'
import useParentSize from '@/hooks/useParentSize'
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'

const CabinResult: React.FC = () => {
  const dispatch = useDispatch()

  const { parentRef, height } = useParentSize()

  const [searchColumns, setSearchColumns] = useState(SelectCabinResultOptions)

  const [searchDefaultForm, setSearchDefaultForm] = useState<CabinResultParams>(
    {
      page: 1,
      limit: 10,
    }
  )

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(false)

  useEffect(() => {
    setImmediate(true)
    if (
      !essential.customerData?.length ||
      !essential.porPortData?.length ||
      !essential.fndPortData?.length ||
      !essential.carrierData?.length
    ) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential])

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
    },
    {
      title: '起运港',
      key: 'porCode',
      align: 'center',
      render(value) {
        return <div>{value.porCode}</div>
      },
    },
    {
      title: '目的港',
      key: 'fndCode',
      align: 'center',
      render(value) {
        return <div>{value.fndCode}</div>
      },
    },
    {
      title: '船司航线',
      key: 'carrierRoute',
      align: 'center',
      render(value) {
        return <div>{value.carrierRoute}</div>
      },
    },
    {
      title: '细分航线',
      key: 'routeName',
      align: 'center',
      render(value) {
        return <div>{value.routeName}</div>
      },
    },
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D')}</div>
      },
    },
    {
      title: '放舱时间',
      key: 'cabinTime',
      align: 'center',
      render(value) {
        return <div>{value.cabinTime}</div>
      },
    },
  ]

  const loadSearchList = () => {
    Promise.all([
      getCustomerManageList(),
      getPorPortManageList(),
      getFndPortManageList(),
      getCarrierManageList({ enabled: 1 }),
    ]).then((resp) => {
      let key = ['customerData', 'porPortData', 'fndPortData', 'carrierData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let {
      customerData = [],
      porPortData = [],
      fndPortData = [],
      carrierData = [],
    } = essential
    let resetPorData = porPortData.map(
      (item: { code: string; enName: string; cnName: string }) => {
        return {
          value: item.code,
          label: item.enName + '-' + item.cnName,
        }
      }
    )
    let resetFndData = fndPortData.map(
      (item: { code: string; enName: string; cnName: string }) => {
        return {
          value: item.code,
          label: item.enName + '-' + item.cnName,
        }
      }
    )
    searchColumns.map((item) => {
      if (
        item.name === 'porCode' ||
        item.name === 'fndCode' ||
        item.name === 'customerId' ||
        item.name === 'carrier'
      ) {
        item.options =
          item.name === 'porCode'
            ? resetPorData
            : item.name === 'fndCode'
            ? resetFndData
            : item.name === 'customerId'
            ? customerData
            : carrierData
      }
    })
    setSearchColumns(searchColumns)
    setImmediate(false)
  }

  const onUpdateSearch = (info?: CabinResultParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const exportResult = () => {}
  return (
    <>
      {/* 菜单检索条件栏 */}
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
            columns={searchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<ExportOutlined />}
            onClick={exportResult}
          >
            导出订舱结果
          </Button>
        </Space>
        <SearchTable
          size="large"
          columns={columns}
          bordered
          rowKey="id"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getCabinResultList}
          searchFilter={searchDefaultForm}
          isSelection={true}
          isPagination={false}
          onUpdatePagination={() => {
            return
          }}
        />
      </Card>
    </>
  )
}

export default CabinResult
