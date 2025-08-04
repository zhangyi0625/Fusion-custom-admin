import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  SelectProps,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import AddRouteManage from './AddRouteManage'
import { SelectRouteManageOptions } from './config'
import {
  addRouteManage,
  deleteRouteManage,
  getRouteManageListByPage,
  updateRouteManage,
} from '@/services/customerInformation/routeManage/routeManageApi'
import type {
  RouteMangeParams,
  RouteMangeType,
} from '@/services/customerInformation/routeManage/routeManageModel'
import { filterKeys } from '@/utils/tool'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import { getFndPortManageList } from '@/services/essential/portManage/portManageModel'
import { PortManageType } from '@/services/essential/portManage/portManageApi'
import useParentSize from '@/hooks/useParentSize'

const RouteManage: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [searchDefaultForm, setSearchDefaultForm] = useState<RouteMangeParams>({
    page: 1,
    limit: 10,
  })

  const [selectOptions, setSelectOptions] = useState(SelectRouteManageOptions)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [immediate, setImmediate] = useState<boolean>(true)

  const [fndPortData, setFndPortData] = useState<SelectProps['options']>([])

  useEffect(() => {
    setImmediate(false)
    if (!essential.fndPortData?.length) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [immediate, essential])

  const columns: TableProps['columns'] = [
    {
      title: '细分航线',
      dataIndex: 'routeName',
      key: 'routeName',
      width: 100,
      align: 'center',
    },
    {
      title: '目的港',
      key: 'fnds',
      align: 'center',
      render(value) {
        return <div>{value.fnds.join(',') ?? ''}</div>
      },
    },
    {
      title: '操作',
      width: '14%',
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
                setParams({ visible: true, currentRow: record, view: true })
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

  const loadSearchList = () => {
    Promise.all([getFndPortManageList()]).then((resp) => {
      let key = ['fndPortData']
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      setTimeout(() => {
        getReduxData()
      }, 500)
    })
  }

  const getReduxData = () => {
    let { fndPortData = [] } = essential
    let fnd = fndPortData.map((item: PortManageType) => {
      return {
        value: item.code,
        label: item.enName + '-' + item.cnName,
      }
    })
    selectOptions.map((item) => {
      if (item.name === 'fnds') item.options = fnd
    })
    setSelectOptions(selectOptions)
    setFndPortData(fnd)
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除航线',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该航线吗？数据删除后将无法恢复！',
      onOk() {
        deleteRouteManage(id).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const onEditOk = async (routeRow: RouteMangeType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addRouteManage(routeRow)
      } else {
        // 编辑数据
        await updateRouteManage(routeRow)
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const onUpdateSearch = (info?: RouteMangeParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
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
            columns={selectOptions}
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
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({ visible: true, currentRow: null, view: true })
            }
          >
            新增航线
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          isCache="routeData"
          scroll={{ x: 'max-content', y: height - 158 }}
          immediate={immediate}
          fetchData={getRouteManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddRouteManage
        fndPortOptions={fndPortData}
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default RouteManage
