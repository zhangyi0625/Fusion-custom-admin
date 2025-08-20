import type React from 'react'
import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  type TableProps,
} from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'
import {
  addDictionaryById,
  deleteDictionaryById,
  getDictionaryList,
  updateDictionaryById,
  batchDeleteDictionaryById,
  getDictionaryListByIdPage,
} from '@/services/system/dictionary/dictionaryApi'
import type {
  SysDictionaryClassType,
  SysDictionaryParams,
  SysDictionaryType,
} from '@/services/system/dictionary/dictionaryModel'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type'
import DictonaryModal from './DictonaryModal'
import { filterKeys } from '@/utils/tool'
import useParentSize from '@/hooks/useParentSize'

const Dictionary: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [dictionaryClass, setDictionaryClass] = useState<
    { id: string; name: string }[]
  >([])

  const [searchDefaultForm, setSearchDefaultForm] = useState<
    Partial<SysDictionaryParams>
  >({
    page: 1,
    limit: 10,
    dictId: null,
  })

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SysDictionaryType | null
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [selRows, setSelectedRows] = useState<string[]>([])

  const [immediate, setImmediate] = useState<boolean>(true)

  useEffect(() => {
    getDicOptions()
  }, [])

  const getDicOptions = async () => {
    setImmediate(true)
    let res = await getDictionaryList()
    let newArr = res.map((item: SysDictionaryClassType) => {
      return {
        ...item,
        id: item.dictId,
        name: item.dictName,
      }
    })
    setDictionaryClass(newArr)
    newArr.length &&
      setSearchDefaultForm({ ...searchDefaultForm, dictId: newArr[0]?.id })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const columns: TableProps['columns'] = [
    {
      title: '字典项名称',
      dataIndex: 'dictDataName',
      key: 'dictDataName',
      align: 'center',
    },
    {
      title: '字典分类',
      dataIndex: 'dictName',
      key: 'dictName',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
      width: 120,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
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
              onClick={() => {
                setParams({
                  visible: true,
                  currentRow: record as SysDictionaryType,
                  view: true,
                })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteDic(record.dictDataId)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const SelectDictionaryOptions: CustomColumn[] = [
    {
      label: '标签分类',
      name: 'dictId',
      formType: 'normalSelect',
      options: dictionaryClass,
      selectFileldName: {
        label: 'dictName',
        value: 'dictId',
      },
      defaultValue: searchDefaultForm?.dictId,
      span: 6,
      selectFetch: false,
      hiddenItem: false,
    },
    {
      label: '字典项名称',
      name: 'dictDataName',
      formType: 'input',
      span: 6,
      selectFetch: false,
      hiddenItem: false,
    },
  ]

  const deleteDic = (id: string[] | string, type?: string) => {
    // 删除操作需要二次确定
    modal.confirm({
      title: `${type ? '批量' : ''}删除字典分类`,
      icon: <ExclamationCircleFilled />,
      content: `确定${
        type ? '批量' : ''
      }删除字典分类吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        ;(type
          ? batchDeleteDictionaryById({ ids: id as string[] })
          : deleteDictionaryById(id as string)
        ).then(() => {
          // 刷新表格数据
          onUpdateSearch({ ...searchDefaultForm })
          // 清空选择项
          setSelectedRows([])
        })
      },
    })
  }

  const onEditOk = async (roleData: SysDictionaryType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addDictionaryById(roleData)
      } else {
        // 编辑数据
        await updateDictionaryById(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch({ ...searchDefaultForm })
    } catch (error) {}
  }

  const onUpdateSearch = (info?: SysDictionaryParams | unknown) => {
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
          {!immediate && (
            <SearchForm
              columns={SelectDictionaryOptions}
              gutterWidth={24}
              iconHidden={true}
              labelPosition="left"
              btnSeparate={false}
              isShowReset={true}
              isShowExpend={false}
              defaultFormItemLayout={{
                labelCol: {
                  xs: { span: 24 },
                  sm: { span: 8 },
                },
                wrapperCol: {
                  xs: { span: 24 },
                  sm: { span: 16 },
                },
              }}
              onUpdateSearch={onUpdateSearch}
            />
          )}
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        {/* 操作按钮 */}
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({ visible: true, currentRow: null, view: false })
            }
          >
            新增
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            disabled={selRows.length === 0}
            onClick={() => deleteDic(selRows, 'batch')}
          >
            批量删除
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          bordered
          rowKey="dictDataId"
          totalKey="count"
          fetchResultKey="list"
          fetchData={getDictionaryListByIdPage}
          searchFilter={searchDefaultForm}
          scroll={{ x: 'max-content', y: height - 158 }}
          isSelection={true}
          isPagination={false}
          immediate={immediate}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
        />
      </Card>
      <DictonaryModal
        params={params}
        onOk={onEditOk}
        dictionaryClass={dictionaryClass}
        defaultdictId={
          SelectDictionaryOptions.find((item) => item.name === 'dictId')
            ?.defaultValue as string
        }
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default Dictionary
