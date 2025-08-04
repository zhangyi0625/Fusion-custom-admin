import '../index.scss'
import { memo, useCallback, useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Row,
  Space,
  TablePaginationConfig,
  TabsProps,
} from 'antd'
import {
  CabinTaskTemplateStatusOptions,
  SelectCabinTaskTemplateOptions,
} from './config'
import type {
  CabinTaskTemplateParams,
  CabinTaskTemplateType,
} from '@/services/cabinManage/cabinManageModel'
import { useDispatch, useSelector } from 'react-redux'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import AddCabinTask from './AddCabinTask'
import ImportShippingAccout from '@/views/customerInformation/ShippingAccount/ImportShippingAccout'
import OperationLogDrawer from './OperationLogDrawer'
import SetFrequecnyDrawer from './SetFrequecnyDrawer'
import { RootState, setEssentail } from '@/stores/store'
import { getTemplateSetting } from './columns'
import {
  getCabinManageListByPage,
  addCabinManageList,
  closeBatchCabinManage,
  openBatchCabinByFrequency,
  openBatchCabinByImmdiate,
  stopBatchCabin,
} from '@/services/cabinManage/cabinManageApi'
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi'
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel'
import { filterKeys } from '@/utils/tool'
import { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel'
import useParentSize from '@/hooks/useParentSize'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'

const API = process.env.VITE_STATIC_API

export type CabinTaskTemplateProps = {
  carrier: string
  setting: unknown
}

const CabinTaskTemplate: React.FC<CabinTaskTemplateProps> = memo(
  ({ carrier, setting }) => {
    const { message } = App.useApp()

    const { parentRef, height } = useParentSize()

    const dispatch = useDispatch()

    const [items, setItems] = useState<TabsProps['items']>([])

    const [searchColumns, setSearchColumns] = useState(
      SelectCabinTaskTemplateOptions
    )

    const essential = useSelector((state: RootState) => state.essentail)

    const [current, setCurrent] = useState<string>('NOT_STARTED')

    const [immediate, setImmediate] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [seleced, setSelected] = useState<string[]>([])

    const isSelected = useCallback(() => {
      if (seleced.length === 0) {
        message.error('请至少选择一条数据！')
        return false
      } else return true
    }, [seleced])

    const [operationLog, setOperationLog] = useState<{
      visible: boolean
      id: null | string
    }>({
      visible: false,
      id: null,
    })

    const [frequecnyParams, setFrequecnyParams] = useState<{
      visible: boolean
      selRow: string[]
    }>({ visible: false, selRow: [] })

    const [importModel, setImportModel] = useState<boolean>(false)

    const tableColumns = useCallback(() => {
      return getTemplateSetting(carrier, current)['columns']?.concat({
        title: '操作',
        width: '8%',
        fixed: 'right',
        align: 'center',
        render(_, record) {
          return (
            <Space>
              <Button
                color="green"
                hidden={current !== 'NOT_STARTED'}
                style={{ background: '#07C160' }}
                variant="solid"
                onClick={() => openImmediate(_)}
              >
                即刻抢舱
              </Button>
              <Button
                hidden={current !== 'RUNNING'}
                color="red"
                variant="solid"
                onClick={() => stopCabin(_)}
              >
                停止抢舱
              </Button>
              <Button
                type="default"
                onClick={() =>
                  setOperationLog({ visible: true, id: record.id })
                }
              >
                操作日志
              </Button>
            </Space>
          )
        },
      })
    }, [getTemplateSetting, current])

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<CabinTaskTemplateParams>({
        page: 1,
        limit: 10,
        routeFndId: null,
        status: 'NOT_STARTED',
      })

    const [params, setParams] = useState<{
      visible: boolean
      currentRow: any
      view: boolean
    }>({
      visible: false,
      currentRow: null,
      view: false,
    })

    useEffect(() => {
      if (!carrier) return
      setImmediate(true)
      setLoading(true)
      if (
        !essential.routeData?.length ||
        !essential.porPortData?.length ||
        !essential.fndPortData?.length ||
        !essential.customerData?.length
      ) {
        loadSearchList()
      } else {
        getReduxData()
      }
    }, [carrier, essential])

    // 重新更新查询部分数据 并存储进redux
    const loadSearchList = () => {
      console.log('重新更新查询条件')
      Promise.all([
        getRouteManageList(),
        getPorPortManageList(),
        getFndPortManageList(),
        getCustomerManageList(),
      ]).then((resp) => {
        let key = ['routeData', 'porPortData', 'fndPortData', 'customerData']
        key.map((_, index: number) => {
          dispatch(setEssentail({ value: resp[index], key: key[index] }))
        })
        getReduxData()
      })
    }

    const getReduxData = () => {
      let { routeData, porPortData, fndPortData, customerData } = essential
      let newRoute = (routeData || []).map((item: RouteMangeType) => {
        return {
          key: String(item.id),
          label: item.routeName,
        }
      })
      setItems([{ label: '全航线', key: '' }].concat(newRoute))
      let resetPorData = (porPortData || []).map(
        (item: { code: string; enName: string; cnName: string }) => {
          return {
            value: item.code,
            label: item.enName + '-' + item.cnName,
          }
        }
      )
      let resetFndData = (fndPortData || []).map(
        (item: { code: string; enName: string; cnName: string }) => {
          return {
            value: item.code,
            label: item.enName + '-' + item.cnName,
          }
        }
      )
      searchColumns.map((item) => {
        if (item.name === 'porCode' || item.name === 'fndCode') {
          item.options = item.name === 'porCode' ? resetPorData : resetFndData
        }
        if (item.name === 'customerId') item.options = customerData
      })
      console.log(essential, 'essentail', searchColumns)
      setSearchColumns([...searchColumns])
      setLoading(false)
      setImmediate(false)
    }

    const tabChange = (key: string) => {
      setSearchDefaultForm({ ...searchDefaultForm, routeFndId: key })
    }

    const changeStatus = (name: string) => {
      setCurrent(name)
      onUpdateSearch({ ...searchDefaultForm, status: name })
    }

    const onUpdateSearch = (info?: CabinTaskTemplateParams | unknown) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(([, value]) => !!value)
      )
      let pageInfo = filterKeys(
        searchDefaultForm,
        ['page', 'limit', 'routeFndId', 'status'],
        true
      )
      setSearchDefaultForm({
        ...pageInfo,
        ...filteredObj,
      })
    }

    const onUpdatePagination = (pagination: TablePaginationConfig) => {
      setSearchDefaultForm({
        ...searchDefaultForm,
        page: pagination.current as number,
        limit: pagination.pageSize as number,
      })
    }

    const downLoadFile = () => {
      let elemIF = document.createElement('iframe')
      elemIF.src = `${API}/static/file/exportBatch-template.xlsx`
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    }

    const addCabinTask = (info: CabinTaskTemplateType) => {
      addCabinManageList({ ...info, carrier: carrier }).then(() => {
        message.success('订舱任务添加成功')
        setParams({ visible: false, currentRow: null, view: false })
        onUpdateSearch(searchDefaultForm)
      })
    }

    const openImmediate = (row: { id: string }) => {
      setSelected([row.id])
      isSelected() && CabinImmediately('immediate')
    }

    const stopCabin = (row: { id: string }) => {
      setSelected([row.id])
      isSelected() && CabinImmediately('stop')
    }

    const CabinImmediately = async (type?: string) => {
      switch (type) {
        case 'close':
          await closeBatchCabinManage(seleced).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
        case 'immediate':
          await openBatchCabinByImmdiate({ ids: seleced }).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
        case 'frequency':
          await openBatchCabinByFrequency({ ids: seleced }).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
        case 'stop':
          await stopBatchCabin({ ids: seleced }).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
      }
      setImmediate(true)
      setTimeout(() => {
        setImmediate(false)
      }, 300)
    }

    const showMessage = (failures: { index: number; failMsg: string }[]) => {
      failures && message.error('操作失败！')
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
          <Card tabList={items} onTabChange={tabChange} loading={loading}>
            <Form
              labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
              labelAlign="left"
              colon={false}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="任务状态">
                    <div className="grid grid-cols-3 mb-[10px] w-fit">
                      {CabinTaskTemplateStatusOptions.map((item) => (
                        <div
                          className={`w-[80px] h-[32px] leading-[30px] text-center rounded-[4px] mr-[8px] cursor-pointer ${
                            current === item.name
                              ? 'text-blue-500 border-1 border-blue-500'
                              : 'text-dull-grey border-1 border-slate-400'
                          }`}
                          key={item.name}
                          onClick={() => changeStatus(item.name)}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <SearchForm
              columns={SelectCabinTaskTemplateOptions}
              gutterWidth={24}
              labelPosition="left"
              btnSeparate={false}
              isShowReset={true}
              isShowExpend={false}
              onUpdateSearch={onUpdateSearch}
            />
          </Card>
        </ConfigProvider>
        <Card
          loading={loading}
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          {current === 'NOT_STARTED' ? (
            <Space className="mb-[8px]">
              <Button
                type="primary"
                onClick={() =>
                  setParams({ visible: true, currentRow: null, view: true })
                }
              >
                创建任务
              </Button>
              <Button
                color="orange"
                variant="solid"
                onClick={() => setImportModel(true)}
              >
                导入任务
              </Button>
              <Button
                color="green"
                style={{ background: '#07C160' }}
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('immediate')}
              >
                即刻抢舱
              </Button>
              <Button
                color="green"
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('frequency')}
              >
                高频启动
              </Button>
              <Button
                color="green"
                variant="solid"
                onClick={() =>
                  setFrequecnyParams({ visible: true, selRow: [] })
                }
              >
                设置放舱同频
              </Button>
              <Button
                color="red"
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('close')}
              >
                关闭任务
              </Button>
              <div
                className="underline text-blue-500 text-sm cursor-pointer"
                onClick={downLoadFile}
              >
                下载MSK抢舱模版
              </div>
            </Space>
          ) : current === 'RUNNING' ? (
            <Space className="mb-[8px]">
              <Button
                hidden={current !== 'RUNNING'}
                color="red"
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('stop')}
              >
                批量停止
              </Button>
            </Space>
          ) : null}
          <SearchTable
            size="middle"
            columns={tableColumns()}
            bordered
            rowKey="id"
            scroll={{ x: 'max-content', y: height - 158 }}
            immediate={immediate}
            fetchData={getCabinManageListByPage}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelected(options)}
          />
        </Card>
        <AddCabinTask
          params={params}
          carrier={carrier}
          onOk={addCabinTask}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, view: false })
          }
        />
        <OperationLogDrawer
          params={operationLog}
          onCancel={() => setOperationLog({ visible: false, id: null })}
        />
        <ImportShippingAccout
          type="importCabinTask"
          title="批量导入任务"
          visible={importModel}
          onOk={() => {}}
          onCancel={() => setImportModel(false)}
        />
        <SetFrequecnyDrawer
          visible={frequecnyParams.visible}
          onCancel={() => setFrequecnyParams({ visible: false, selRow: [] })}
          onOk={(ids: string[]) =>
            setFrequecnyParams({ visible: false, selRow: ids })
          }
        />
      </>
    )
  }
)

export default CabinTaskTemplate
