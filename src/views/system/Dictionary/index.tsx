import type React from 'react'
import { Key, useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Space,
  TablePaginationConfig,
  Tree,
  type TableProps,
} from 'antd'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import {
  addDictionaryById,
  deleteDictionaryById,
  getDictionaryList,
  updateDictionaryById,
  batchDeleteDictionaryById,
  getDictionaryListByIdPage,
  addDictionary,
  updateDictionary,
  deleteDictionary,
} from '@/services/system/dictionary/dictionaryApi'
import type {
  SysDictionaryClassType,
  SysDictionaryParams,
  SysDictionaryType,
} from '@/services/system/dictionary/dictionaryModel'
import { SearchTable } from 'customer-search-form-table'
import DictonaryModal from './DictonaryModal'
import { filterKeys } from '@/utils/tool'
import useParentSize from '@/hooks/useParentSize'
import DictonaryClassModal from '../DictionaryClass/DictonaryClassModal'

const Dictionary: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const [dictionaryClass, setDictionaryClass] = useState([])

  const [searchDefaultForm, setSearchDefaultForm] = useState<
    Partial<SysDictionaryParams>
  >({
    page: 1,
    limit: 10,
    dictId: null,
    keywords: '',
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

  const [dictonaryParams, setDictonaryParams] = useState<{
    visible: boolean
    currentRow: SysDictionaryClassType | null
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
        key: item.dictId,
        title: item.dictName,
      }
    })
    setDictionaryClass(newArr)
    newArr.length &&
      setSearchDefaultForm({
        ...searchDefaultForm,
        dictId: searchDefaultForm.dictId ?? newArr[0]?.dictId,
      })
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
      width: 120,
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

  const onEditDictonaryClassOk = async (roleData: SysDictionaryClassType) => {
    try {
      if (dictonaryParams.currentRow == null) {
        // 新增数据
        await addDictionary(roleData)
      } else {
        // 编辑数据
        await updateDictionary(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setDictonaryParams({ visible: false, currentRow: null, view: false })
      getDicOptions()
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

  const treeClick = (e: Key[]) => {
    setSearchDefaultForm({ ...searchDefaultForm, dictId: e[0] as string })
  }

  const deleteDictionaryClass = () => {
    modal.confirm({
      title: '删除字典分类',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该字典分类吗？数据删除后将无法恢复！',
      onOk() {
        deleteDictionary(searchDefaultForm.dictId as string).then(() => {
          // 刷新表格数据
          getDicOptions()
        })
      },
    })
  }

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
          loading={immediate}
        >
          <div className="flex items-start h-full">
            <div className="flex flex-col">
              <Space>
                <Button
                  type="primary"
                  onClick={() =>
                    setDictonaryParams({
                      visible: true,
                      currentRow: null,
                      view: false,
                    })
                  }
                >
                  新增
                </Button>
                <Button
                  color="orange"
                  variant="solid"
                  onClick={() =>
                    setDictonaryParams({
                      visible: true,
                      currentRow: dictionaryClass.find(
                        (item: { key: string }) =>
                          item.key === searchDefaultForm.dictId
                      ) as unknown as SysDictionaryClassType,
                      view: false,
                    })
                  }
                >
                  修改
                </Button>
                <Button type="primary" danger onClick={deleteDictionaryClass}>
                  删除
                </Button>
              </Space>
              <div
                className={`w-[300px] rounded-[2px] h-full border-1 border-slate-100 p-[10px] mt-[25px]`}
              >
                <Tree
                  defaultExpandAll
                  switcherIcon={<DownOutlined />}
                  treeData={dictionaryClass}
                  onSelect={treeClick}
                  defaultSelectedKeys={[searchDefaultForm.dictId] as string[]}
                />
              </div>
            </div>
            <div
              className="ml-[24px] h-full"
              style={{ width: 'calc(100% - 250px)' }}
            >
              <Form labelCol={{ span: 6 }}>
                <Row gutter={24} style={{ margin: '0' }}>
                  <Col span={8}>
                    <Form.Item name="keywords">
                      <Input
                        value={searchDefaultForm.keywords as string}
                        placeholder="字典数据代码或字典数据名称"
                        allowClear
                        onChange={(e: any) =>
                          setSearchDefaultForm({
                            ...searchDefaultForm,
                            keywords: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() =>
                          setParams({
                            visible: true,
                            currentRow: null,
                            view: false,
                          })
                        }
                      >
                        新增
                      </Button>
                      <Button
                        type="default"
                        danger
                        disabled={selRows.length === 0}
                        onClick={() => deleteDic(selRows, 'batch')}
                      >
                        批量删除
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
              <SearchTable
                size="small"
                columns={columns}
                bordered
                rowKey="dictDataId"
                totalKey="count"
                fetchResultKey="list"
                pageIndexKey="page"
                pageSizeKey="limit"
                fetchData={getDictionaryListByIdPage}
                searchFilter={searchDefaultForm}
                scroll={{ x: 'max-content', y: height - 158 }}
                isSelection={true}
                isPagination={false}
                immediate={immediate}
                onUpdatePagination={onUpdatePagination}
                onUpdateSelection={(options: string[]) =>
                  setSelectedRows(options)
                }
              />
            </div>
          </div>
        </Card>
      </ConfigProvider>
      <DictonaryClassModal
        params={dictonaryParams}
        onOk={onEditDictonaryClassOk}
        onCancel={() =>
          setDictonaryParams({ visible: false, currentRow: null, view: false })
        }
      />
      <DictonaryModal
        params={params}
        onOk={onEditOk}
        dictionaryClass={dictionaryClass}
        defaultdictId={searchDefaultForm.dictId as string}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default Dictionary
