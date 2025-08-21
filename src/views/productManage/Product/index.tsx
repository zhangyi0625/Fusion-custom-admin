import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import { ProductSearchColumns } from '../config'
import useParentSize from '@/hooks/useParentSize'
import type { ProductManageType } from '@/services/productManage/productManageModel'
import {
  deleteProduct,
  addProduct,
  updateProduct,
  getProductByPage,
  getProductClassList,
} from '@/services/productManage/productManageApi'
import AddProduct from './AddProduct'
import { filterKeys } from '@/utils/tool'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'

const Product: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(true)

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [searchColumns, setSearchColumns] = useState(ProductSearchColumns)

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: ProductManageType | null
  }>({
    visible: false,
    currentRow: null,
  })

  useEffect(() => {
    setImmediate(true)
    if (!essential.productClass?.length) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential])

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = async () => {
    let resp = await getProductClassList({ parentId: 0, sort: 'sort' })
    for (let item of resp) {
      let res = await getProductClassList({
        parentId: item.id,
        sort: 'sort',
      })
      Reflect.set(item, 'children', res)
    }
    dispatch(setEssentail({ value: resp, key: 'productClass' }))
    getReduxData()
  }

  const getReduxData = () => {
    let { productClass } = essential
    searchColumns.map((item) => {
      if (
        item.customPlaceholder &&
        productClass?.find((el) =>
          el.name?.includes(item.customPlaceholder as string)
        )
      ) {
        item.options = productClass?.find((el) =>
          el.name?.includes(item.customPlaceholder as string)
        )?.children
      }
    })
    setSearchColumns([...searchColumns])
    setImmediate(false)
  }

  const tableColumns: TableProps['columns'] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '产品名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 250,
    },
    {
      title: '拼音码',
      key: 'pinyin',
      dataIndex: 'pinyin',
      align: 'center',
      width: 120,
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      align: 'center',
      width: 100,
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render(value) {
        return <div>{value.status ? '启用' : '不启用'}</div>
      },
      width: 100,
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      align: 'center',
      width: 100,
    },
    {
      title: '创建人',
      key: 'createName',
      dataIndex: 'createName',
      align: 'center',
      width: 100,
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
      title: '删除该产品',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该产品吗？数据删除后将无法恢复！',
      onOk() {
        deleteProduct(id).then(() => {
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

  const onEditOk = async (customerRow: ProductManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addProduct(customerRow)
      } else {
        // 编辑数据
        await updateProduct(customerRow)
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
        <Card>
          <SearchForm
            columns={ProductSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            showRow={2}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 0 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
              },
            }}
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            iconHidden={true}
            searchBtnText="查询"
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px] float-right">
          <Button
            type="primary"
            style={{ zIndex: 99 }}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增产品
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          immediate={immediate}
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getProductByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddProduct
        params={params}
        ProductSearchColumns={ProductSearchColumns}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
    </>
  )
}

export default Product
