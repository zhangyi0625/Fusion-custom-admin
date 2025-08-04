import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import {
  ExclamationCircleFilled,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { RootState, setEssentail } from '@/stores/store'
import {
  SelectShippingAccountOptions,
  ShippingAccountOperationBtn,
} from './config'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import {
  ShippingAccounParams,
  ShippingAccounType,
} from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import {
  getShippingAccountListByPage,
  addShippingAccountList,
  batchImportShippingAccount,
  putShippingAccountList,
  deleteShippingAccountList,
  relevanceShippingAccountClose,
} from '@/services/customerInformation/shippingAccount/shippingAccountApi'
import AddShippingAccount from './AddShippingAccount'
import ImportShippingAccout from './ImportShippingAccout'
import SetRelevanceModal from './setRelevanceModal'
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'
import type { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'
import type { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel'
import { filterKeys } from '@/utils/tool'
import { formatTime } from '@/utils/format'
import useParentSize from '@/hooks/useParentSize'
import type { ServiceSettingType } from '@/services/setting/serviceSettingModel'

const API = process.env.VITE_STATIC_API

const ShippingAccount: React.FC = () => {
  const { modal, message } = App.useApp()

  const routeParams = useParams()

  const location = useLocation()

  const { parentRef, height } = useParentSize()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [selectoptions, setSelectOptions] = useState(
    SelectShippingAccountOptions
  )

  const [relevanceModal, setRelevanceModal] = useState<boolean>(false)

  const [selRows, setSelectedRows] = useState<any[]>([])

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingAccounParams>({
      page: 1,
      limit: 10,
      carrier: null,
      account: null,
    })

  const [carrierOptions, setCarrierOptions] = useState<CarrierManageType[]>([])

  const [customerOptions, setCustomerOptions] = useState<CustomerManageType[]>(
    []
  )

  const [immediate, setImmediate] = useState<boolean>(false)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
    type: string
  }>({
    visible: false,
    currentRow: null,
    view: false,
    type: 'QUERY',
  })

  const [importModel, setImportModel] = useState<boolean>(false)

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      dataIndex: 'carrier',
      key: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      align: 'center',
      width: 200,
    },
    {
      title: '船司账号',
      dataIndex: 'account',
      key: 'account',
      width: 200,
      align: 'center',
    },
    {
      title: '账号抬头',
      dataIndex: 'accountHead',
      key: 'accountHead',
      align: 'center',
      width: 100,
    },
    {
      title: '设为查询',
      key: 'isQuery',
      align: 'center',
      width: 100,
      hidden: params.type === 'QUERY',
      render(value) {
        return <div>{value?.isQuery ? '已设置' : '-'}</div>
      },
    },
    {
      title: '账号状态',
      key: 'vaild',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div className={`text-${value.isValid ? 'blue' : 'red'}-500`}>
            {value.vaild ? '有效' : '无效'}
          </div>
        )
      },
    },
    {
      title: '是否启用',
      key: 'isEnable',
      align: 'center',
      width: 100,
      render(value) {
        return (
          <div className={`text-${value.isEnable ? 'blue' : 'red'}-500`}>
            {value.isEnable ? '启用' : '不启用'}
          </div>
        )
      },
    },
    {
      title: '关联服务',
      key: 'serverName',
      dataIndex: 'serverName',
      align: 'center',
      width: 120,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{formatTime(value.updateTime, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '操作',
      width: '10%',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render(_, record) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() =>
                setParams({
                  ...params,
                  visible: true,
                  currentRow: record,
                  view: true,
                })
              }
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(record.id)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    let name = location.pathname.split(
      '/customerInformation/shippingAccount/'
    )[1]
    setImmediate(true)
    if (!essential.carrierData?.length || !essential.routeData?.length) {
      loadSearchList()
    } else {
      getReduxData()
    }
    setParams({ ...params, type: name })
    console.log(routeParams, 'routeParams', location, name)
  }, [location.pathname, params.type, essential])

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    Promise.all([
      getCarrierManageList({ enabled: 1 }),
      getCustomerManageList(),
    ]).then((resp) => {
      let key = ['carrierData', 'customerData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let { carrierData = [], customerData = [] } = essential
    selectoptions.map((item) => {
      if (item.name === 'carrier') item.options = carrierData
      if (item.name === 'customerId') item.options = customerData
      if (item.name === 'serverName') item.hidden = params.type !== 'QUERY'
      if (item.name === 'isQuery') item.hidden = params.type !== 'ORDER'
    })
    console.log(selectoptions, 'selectOptions')
    setCustomerOptions(customerData)
    setSelectOptions([...selectoptions])
    setCarrierOptions(carrierData)
    setImmediate(false)
  }

  const operationShippingAccount = (type?: string) => {
    if (selRows.length === 0) {
      message.error('请至少选择一个船司账号！')
    } else {
      if (!type) {
        setRelevanceModal(true)
        return
      }
      ;(ShippingAccountOperationBtn as any)[type](selRows).then(() => {
        message.success('操作成功')
        onUpdateSearch(searchDefaultForm)
        // setSelectedRows([])
      })
    }
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除船司账号',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司账号吗？数据删除后将无法恢复！',
      onOk() {
        deleteShippingAccountList(id).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const downLoadFile = () => {
    let elemIF = document.createElement('iframe')
    elemIF.src = `${API}/static/file/importShippingAccount-template.xlsx`
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  }

  const onUpdateSearch = (info?: ShippingAccounParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => value !== undefined || value !== null
      )
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
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

  const onEditOk = async (roleData: ShippingAccounType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addShippingAccountList(roleData)
      } else {
        // 编辑数据
        await putShippingAccountList(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ ...params, visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const importShippingAccount = (info: any) => {
    batchImportShippingAccount(info).then(() => {
      message.success('导入成功')
      setImportModel(false)
      onUpdateSearch(searchDefaultForm)
    })
  }

  const relevanceService = (params: { serverNo: string }) => {
    relevanceShippingAccountClose({
      ids: selRows,
      serverNo: params.serverNo,
    }).then(() => {
      message.success('关联服务成功')
      setRelevanceModal(false)
      onUpdateSearch(searchDefaultForm)
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
            columns={selectoptions}
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
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({
                visible: true,
                currentRow: null,
                view: true,
                type: params.type,
              })
            }
          >
            添加账号
          </Button>
          <Button
            color="orange"
            icon={<ImportOutlined />}
            variant="solid"
            onClick={() => setImportModel(true)}
          >
            批量导入账号
          </Button>
          <Button
            hidden={params.type !== 'ORDER'}
            color="primary"
            variant="outlined"
            onClick={() => operationShippingAccount('search')}
          >
            设为查询
          </Button>
          <Button
            hidden={params.type !== 'ORDER'}
            color="primary"
            variant="outlined"
            onClick={() => operationShippingAccount('cancelSearch')}
          >
            取消查询
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => operationShippingAccount('close')}
          >
            关闭账号
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => operationShippingAccount('open')}
          >
            启用账号
          </Button>
          <Button
            hidden={params.type !== 'QUERY'}
            color="primary"
            variant="outlined"
            onClick={() => operationShippingAccount()}
          >
            关联服务
          </Button>
          <Button
            type="link"
            color="primary"
            onClick={downLoadFile}
            className="underline text-blue-500 text-sm cursor-pointer"
          >
            下载账号导入模版
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getShippingAccountListByPage}
          immediate={immediate}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
        />
      </Card>
      <AddShippingAccount
        params={params}
        carrierOptions={carrierOptions}
        customerOptions={customerOptions}
        onOk={onEditOk}
        onCancel={() =>
          setParams({
            ...params,
            visible: false,
            currentRow: null,
            view: false,
          })
        }
      />
      <ImportShippingAccout
        title="导入船司账号"
        options={customerOptions}
        type="importShippingAccount"
        visible={importModel}
        onOk={importShippingAccount}
        onCancel={() => setImportModel(false)}
      />
      <SetRelevanceModal
        visible={relevanceModal}
        revelanceOptions={
          SelectShippingAccountOptions.find(
            (item) => item.name === 'serverName'
          )?.options as ServiceSettingType[]
        }
        onOk={relevanceService}
        onCancel={() => setRelevanceModal(false)}
      />
    </>
  )
}

export default ShippingAccount
