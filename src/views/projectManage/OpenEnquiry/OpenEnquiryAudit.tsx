import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  GetProp,
  Input,
  InputRef,
  Space,
  Table,
  Image,
  TableProps,
  UploadProps,
} from 'antd'
import ProductTransfer from '../ProductTransfer'
import AddProduct from '@/views/productManage/Product/AddProduct'
import EditQuotation from '../EditQuotation'
import type { BusinessEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { ProductSearchColumns } from '@/views/productManage/config'
import type { ProductManageType } from '@/services/productManage/productManageModel'
import {
  getOpenEnquiryListDetail,
  postAllocationEnquiry,
} from '@/services/projectManage/OpenEnquiry/OpenEnquiryApi'
import { OpenEnquiryType } from '@/services/projectManage/OpenEnquiry/OpenEnquiryModel'
import { postPreviewFile } from '@/services/upload/UploadApi'

export type OpenEnquiryAuditProps = {
  params: {
    visible: boolean
    currentRow: OpenEnquiryType | null
  }
  onCancel: () => void
  onAuditEnquiry: (
    status: string,
    rejectReason?: string,
    selectedArr?: ProductManageType[],
  ) => void
}

type ColumnTypes = Exclude<TableProps<any>['columns'], undefined>

interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof any
  record: any
  handleSave: (record: BusinessEnquiryProductType) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const EditableContext = React.createContext<FormInstance<any> | null>(null)

const OpenEnquiryAudit: React.FC<OpenEnquiryAuditProps> = ({
  params,
  onCancel,
  onAuditEnquiry,
}) => {
  const { visible, currentRow } = params

  const [dataSource, setDataSource] = useState<any[]>([])

  const [selectProduct, setSelectProduct] = useState<{
    visible: boolean
    selected: BusinessEnquiryProductType[] | null
  }>({
    visible: false,
    selected: null,
  })

  const [previewImage, setPreviewImage] = useState('')

  const [editQuotationVisible, setEditQuotationVisible] =
    useState<boolean>(false)

  const [modalShow, setModalShow] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return
    setDataSource([])
    loadEnquiryDetail()
    setPreviewImage('')
  }, [visible])

  const [previewOpen, setPreviewOpen] = useState(false)

  const loadEnquiryDetail = async () => {
    const resp = await getOpenEnquiryListDetail(currentRow?.id as string)
    setDataSource(resp.products)
    currentRow?.files.length && preview(currentRow.files[0])
  }

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

  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)

    const inputRef = useRef<InputRef>(null)

    const form = useContext(EditableContext)!

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex as string}
          rules={[{ required: true, message: `${title} is required.` }]}
        >
          <Input
            ref={inputRef}
            type="number"
            style={{ width: '88px' }}
            min={0}
            onPressEnter={save}
            onBlur={save}
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingInlineEnd: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  const tableColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex?: string
  })[] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '产品名称',
      key: 'productName',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '规格型号',
      key: 'productSpec',
      dataIndex: 'productSpec',
      align: 'center',
    },
    {
      title: '单位',
      key: 'productUnit',
      dataIndex: 'productUnit',
      align: 'center',
    },
    {
      title: '采购数量',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
      editable: true,
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button onClick={() => deleteItem(_)} color="danger" variant="link">
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })
  const handleSave = (row: any) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    newData.sort((a, b) => a.sort - b.sort)
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const deleteItem = (row: BusinessEnquiryProductType) => {
    let filter = dataSource.filter(
      (item) => item.productName !== row.productName,
    )
    setDataSource(filter)
  }

  const updateEnquiryProduct = (current: BusinessEnquiryProductType[]) => {
    let newArr: BusinessEnquiryProductType[] = []
    current.map((item) => {
      if (
        dataSource.find((el) => el.productName !== item.productName) ||
        !dataSource.length
      ) {
        item.qty =
          dataSource.find((items) => items.productName === item.productName)
            ?.qty ?? 0
        item.productId = item.id as string
        item.id = null
        newArr.push(item)
      }
    })
    postAllocationEnquiry(
      currentRow?.id as string,
      newArr as unknown as ProductManageType[],
    ).then(() => {
      loadEnquiryDetail()
      setSelectProduct({ visible: false, selected: null })
    })
    // setDataSource(newArr)
    // setSelectProduct({ visible: false, selected: null })
    // console.log(currentRow, 'currentRow', dataSource, newArr)
  }

  const onEditOk = (customerRow: ProductManageType) => {
    dataSource.unshift(customerRow)
    setModalShow(false)
  }

  const confirmEditQuotation = (info: { modifyReason: string }) => {
    setEditQuotationVisible(false)
    onAuditEnquiry('REVIEW_REJECTED', info.modifyReason)
  }

  const confirmAudit = () => {
    onAuditEnquiry('PENDING_QUOTE', '', dataSource)
  }

  return (
    <Drawer
      title="询价审核"
      width={912}
      open={visible}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={() => setEditQuotationVisible(true)} type="primary">
            拒绝通过
          </Button>
          <Button onClick={confirmAudit} type="primary">
            保存审核
          </Button>
        </Space>
      }
    >
      <div>
        {currentRow?.files.length ? (
          <>
            <p className="font-semibold">询价图片</p>
            <div className="w-full h-[320px] mt-[12px] bg-gray-100 text-center">
              {previewImage && (
                <Image
                  style={{ width: '347px', height: '320px', margin: '0 auto' }}
                  src={previewImage}
                />
              )}
            </div>
          </>
        ) : null}
        <div className="mt-[35px] mb-[10px] flex items-center justify-between">
          <p className="font-semibold">生成询价表</p>
          <Space>
            <Button onClick={() => setModalShow(true)}>新增产品</Button>
            <Button
              onClick={() =>
                setSelectProduct({ visible: true, selected: dataSource })
              }
              type="primary"
            >
              选择产品
            </Button>
          </Space>
        </div>
        <Table<BusinessEnquiryProductType>
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          rowKey={'productId'}
          size="small"
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: currentRow?.files.length ? 198 : 688 }}
          columns={mergedColumns as ColumnTypes}
          pagination={false}
        />
      </div>
      <ProductTransfer
        params={selectProduct}
        projectId={null}
        onCancel={() => setSelectProduct({ visible: false, selected: null })}
        onOk={updateEnquiryProduct}
      />
      <AddProduct
        params={{ visible: modalShow, currentRow: null }}
        type="systemProducts"
        ProductSearchColumns={ProductSearchColumns}
        onOk={onEditOk}
        onCancel={() => setModalShow(false)}
      />
      <EditQuotation
        title="拒绝通过原因"
        visible={editQuotationVisible}
        onCancel={() => setEditQuotationVisible(false)}
        onOk={confirmEditQuotation}
      />
    </Drawer>
  )
}

export default OpenEnquiryAudit
