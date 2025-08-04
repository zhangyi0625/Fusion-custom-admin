import { useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { filterKeys } from '@/utils/tool'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import {
  CarrierManageParams,
  CarrierManageType,
} from '@/services/essential/carrierManage/carrierManageModel'
import {
  addCarrierManage,
  deleteCarrierManage,
  getCarrierManageListByPage,
  putCarrierManage,
} from '@/services/essential/carrierManage/carrierManageApi'
import { SelectCarrierManageOptions } from './config'
import AddCarrierManage from './AddCarrierManage'
import useParentSize from '@/hooks/useParentSize'

const CarrierManage: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CarrierManageParams>({
      page: 1,
      limit: 10,
      code: null,
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

  const columns: TableProps['columns'] = [
    {
      title: '船司代码',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: '船司中文名',
      dataIndex: 'cnName',
      key: 'cnName',
      align: 'center',
    },
    {
      title: '船司英文名',
      dataIndex: 'enName',
      key: 'enName',
      width: 120,
      align: 'center',
    },
    {
      title: '船司logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      align: 'center',
      render(value) {
        return <img src={value} className="w-[48px] h-[48px] m-auto" alt="" />
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 200,
      align: 'center',
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

  const onEditOk = async (customerRow: CarrierManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addCarrierManage(customerRow)
      } else {
        // 编辑数据
        await putCarrierManage(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除船司',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司吗？数据删除后将无法恢复！',
      onOk() {
        deleteCarrierManage(id).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const onUpdateSearch = (info?: CarrierManageParams | unknown) => {
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
            columns={SelectCarrierManageOptions}
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
            新增船司
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getCarrierManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddCarrierManage
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default CarrierManage
