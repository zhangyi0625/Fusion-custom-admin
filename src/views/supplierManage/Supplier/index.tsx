import { useState } from 'react'
import {
  App,
  Image,
  Button,
  Card,
  ConfigProvider,
  GetProp,
  Space,
  TablePaginationConfig,
  TableProps,
  UploadProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import useParentSize from '@/hooks/useParentSize'
import { filterKeys } from '@/utils/tool'
import type { SupplierType } from '@/services/supplierManage/Supplier/SupplierModel'
import {
  addSupplier,
  deleteSupplier,
  getSupplierByPage,
  updateSupplier,
} from '@/services/supplierManage/Supplier/SupplierApi'
import AddSupplier from './AddSupplier'
import SupplierRecord from './SupplierRecord'
import { SupplierSearchColumns } from '../config'
import { postPreviewFile } from '@/services/Upload/UploadApi'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const Supplier: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    page: 1,
    limit: 10,
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SupplierType | null
  }>({
    visible: false,
    currentRow: null,
  })

  const [supplierDrawer, setSupplierDrawer] = useState<{
    visible: boolean
    id: string
  }>({
    visible: false,
    id: '',
  })

  const [previewImage, setPreviewImage] = useState('')

  const [previewOpen, setPreviewOpen] = useState(false)

  const tableColumns: TableProps['columns'] = [
    {
      title: '供应商',
      key: 'name',
      align: 'center',
      width: 150,
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setSupplierDrawer({ visible: true, id: value.id })}
          >
            {value.name}
          </div>
        )
      },
    },
    {
      title: 'logo',
      key: 'logoName',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div
            className="text-gray-500 cursor-pointer underline"
            onClick={() => preview(value.logo)}
          >
            {value.logoName}
          </div>
        )
      },
    },
    {
      title: '社会统一信用代码',
      key: 'code',
      dataIndex: 'code',
      align: 'center',
      width: 200,
    },
    {
      title: '主联系人',
      key: 'contactName',
      dataIndex: 'contactName',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号',
      key: 'contactPhone',
      dataIndex: 'contactPhone',
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

  const preview = (id: string) => {
    postPreviewFile(id).then(async (resp) => {
      const file = await getBase64(resp as unknown as FileType)
      setPreviewImage(file)
      setPreviewOpen(true)
    })
  }

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除该供应商',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该供应商吗？数据删除后将无法恢复！',
      onOk() {
        deleteSupplier(id).then(() => {
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

  const onEditOk = async (customerRow: SupplierType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addSupplier(customerRow)
      } else {
        // 编辑数据
        await updateSupplier(customerRow)
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
            columns={SupplierSearchColumns}
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
            新增供应商
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={tableColumns}
          bordered
          rowKey="id"
          totalKey="count"
          fetchResultKey="list"
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getSupplierByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          isPagination={true}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddSupplier
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
      <SupplierRecord
        params={supplierDrawer}
        onCancel={() => setSupplierDrawer({ visible: false, id: '' })}
      />
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  )
}

export default Supplier
