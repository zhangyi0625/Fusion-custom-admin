import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, ConfigProvider, TableProps } from 'antd'
import { RootState, setEssentail } from '@/stores/store'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { SelectCabinHistoryOptions } from './config'
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi'
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel'
import type { CabinHistoryParams } from '@/services/cabinManage/cabinManageModel'
import { getCabinHistoryList } from '@/services/cabinManage/cabinManageApi'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import useParentSize from '@/hooks/useParentSize'

const CabinHistory: React.FC = () => {
  const dispatch = useDispatch()

  const { parentRef, height } = useParentSize()

  const [searchColumns, setSearchColumns] = useState(SelectCabinHistoryOptions)

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CabinHistoryParams>({
      page: 1,
      limit: 10,
      router: null,
    })

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(false)

  useEffect(() => {
    setImmediate(true)
    if (
      !essential.routeData?.length ||
      !essential.porPortData?.length ||
      !essential.fndPortData?.length
    ) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential])

  const loadSearchList = () => {
    Promise.all([
      getRouteManageList(),
      getPorPortManageList(),
      getFndPortManageList(),
    ]).then((resp) => {
      let key = ['routeData', 'porPortData', 'fndPortData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let { routeData = [], porPortData = [], fndPortData = [] } = essential
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
        item.name === 'router'
      ) {
        item.options =
          item.name === 'porCode'
            ? resetPorData
            : item.name === 'fndCode'
            ? resetFndData
            : routeData
      }
    })
    setSearchColumns(searchColumns)
    setImmediate(false)
  }

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
      key: 'carrierRouter',
      align: 'center',
      render(value) {
        return <div>{value.carrierRouter}</div>
      },
    },
    {
      title: '细分航线',
      key: 'router',
      align: 'center',
      render(value) {
        return <div>{value.router}</div>
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
      key: 'stowageTime',
      align: 'center',
      render(value) {
        return (
          <div>
            {value.stowageTime} {value.stowageWeek}
          </div>
        )
      },
    },
  ]

  const onUpdateSearch = (info?: CabinHistoryParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }
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
            columns={SelectCabinHistoryOptions}
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
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          immediate={immediate}
          fetchData={getCabinHistoryList}
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

export default CabinHistory
