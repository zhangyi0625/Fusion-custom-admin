import { useCallback, useEffect, useState } from 'react'
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
  TableProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { SearchTable } from 'customer-search-form-table'
import useParentSize from '@/hooks/useParentSize'
import {
  addProductClass,
  deleteProductClass,
  getProductClassByPage,
  getProductClassList,
  updateProductClass,
} from '@/services/productManage/productManageApi'
import type {
  ProductClassParams,
  ProductManageClassType,
} from '@/services/productManage/productManageModel'
import AddProductClass from './AddProductClass'
import { filterKeys } from '@/utils/tool'

const ProductClass: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [immediate, setImmediate] = useState<boolean>(true)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: ProductManageClassType | null
    name?: string | null
  }>({
    visible: false,
    currentRow: null,
    name: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ProductClassParams>({
      page: 1,
      limit: 10,
      name: null,
      parentId: 0,
      sort: 'sort',
    })

  const [parentProductClass, setParentProductClass] = useState<
    ProductManageClassType[]
  >([])

  useEffect(() => {
    loadParentProductClass()
  }, [])

  const loadParentProductClass = async () => {
    const res = await getProductClassList({ parentId: 0, sort: 'desc' })
    setParentProductClass(res)
    setSearchDefaultForm({ ...searchDefaultForm, parentId: res[0].id })
    setImmediate(false)
  }

  const getName = useCallback(() => {
    return parentProductClass.find(
      (item) => searchDefaultForm.parentId === item.id
    )?.name
  }, [searchDefaultForm.parentId])

  const tableColumns: TableProps['columns'] = [
    {
      title: getName() ?? '产品型号',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 200,
    },
    {
      title: '创建人',
      key: 'createName',
      dataIndex: 'createName',
      align: 'center',
    },
    {
      title: '创建日期',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              onClick={() =>
                setParams({
                  visible: true,
                  currentRow: _,
                  name: getName(),
                })
              }
              type="link"
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="link"
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const deleteItem = (id: string) => {
    modal.confirm({
      title: `删除${getName()}`,
      icon: <ExclamationCircleFilled />,
      content: `确定删除该${getName()}吗？数据删除后将无法恢复！`,
      onOk() {
        deleteProductClass(id).then(() => {
          message.success('删除成功')
          // 刷新表格数据
          onUpdateSearch(searchDefaultForm)
        })
      },
    })
  }

  const onUpdateSearch = (info?: unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const changeProductClass = (id: string) => {
    setSearchDefaultForm({ ...searchDefaultForm, parentId: id })
    setImmediate(false)
  }

  const onEditOk = async (customerRow: ProductManageClassType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addProductClass({
          ...customerRow,
          parentId: searchDefaultForm.parentId as string,
        })
      } else {
        // 编辑数据
        await updateProductClass(customerRow)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null })
      onUpdateSearch(searchDefaultForm)
    } catch (error) {}
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
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
          loading={immediate}
        >
          <div className="flex items-start h-full">
            <div
              className={`w-[220px] rounded-[2px] h-full border-1 border-slate-100`}
            >
              {parentProductClass.map((item) => (
                <div
                  className={`h-[44px] pl-[12px] leading-[44px] cursor-pointer ${
                    item.id === searchDefaultForm.parentId
                      ? 'text-blue-500 bg-slate-100 font-semibold'
                      : ''
                  }`}
                  key={item.id}
                  onClick={() => changeProductClass(item.id as string)}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <div className="flex-1 ml-[24px] h-full">
              <Form labelCol={{ span: 6 }}>
                <Row gutter={24} style={{ margin: '0' }}>
                  <Col span={8}>
                    <Form.Item name="model">
                      <Input
                        value={searchDefaultForm.name as string}
                        placeholder={`请输入${getName()}`}
                        allowClear
                        onChange={(e: any) =>
                          setSearchDefaultForm({
                            ...searchDefaultForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => onUpdateSearch(searchDefaultForm)}
                      >
                        查询
                      </Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          setParams({
                            visible: true,
                            currentRow: null,
                            name: getName(),
                          })
                        }
                      >
                        新增
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
              <SearchTable
                size="middle"
                columns={tableColumns}
                bordered
                rowKey="id"
                totalKey="count"
                fetchResultKey="list"
                immediate={immediate}
                scroll={{ x: 'max-content', y: height - 188 }}
                fetchData={getProductClassByPage}
                searchFilter={searchDefaultForm}
                isSelection={false}
                isPagination={true}
                onUpdatePagination={onUpdatePagination}
              />
            </div>
          </div>
        </Card>
      </ConfigProvider>
      <AddProductClass
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
    </>
  )
}

export default ProductClass
