import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputRef,
  Space,
  Table,
  TableProps,
} from 'antd'
import ProductTransfer from '../ProductTransfer'
import AddProduct from '@/views/productManage/Product/AddProduct'
import EditQuotation from '../EditQuotation'
import type { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { ProductSearchColumns } from '@/views/productManage/config'
import type { ProductManageType } from '@/services/productManage/productManageModel'

export type OpenEnquiryAuditProps = {
  params: {
    visible: boolean
  }
  onCancel: () => void
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
  handleSave: (record: BussinesEnquiryProductType) => void
}

const EditableContext = React.createContext<FormInstance<any> | null>(null)

const OpenEnquiryAudit: React.FC<OpenEnquiryAuditProps> = ({
  params,
  onCancel,
}) => {
  const { visible } = params

  const [dataSource, setDataSource] = useState<any[]>([])

  const [selectProduct, setSelectProduct] = useState<{
    visible: boolean
    selected: BussinesEnquiryProductType[] | null
  }>({
    visible: false,
    selected: null,
  })

  const [editQuotationVisible, setEditQuotationVisible] =
    useState<boolean>(false)

  const [modalShow, setModalShow] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return
    setDataSource([])
  }, [visible])

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
    // {
    //   title: '排序',
    //   key: 'sort',
    //   dataIndex: 'sort',
    //   align: 'center',
    //   editable: true,
    // },
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
    // putBusinessEnquiryProduct(row).then(() => {
    //   message.success('修改成功')
    //   loadEnquiryProduct()
    // })
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

  const deleteItem = (row: BussinesEnquiryProductType) => {
    let filter = dataSource.filter(
      (item) => item.productName !== row.productName
    )
    setDataSource(filter)
  }

  const updateEnquiryProduct = (currentRow: BussinesEnquiryProductType[]) => {
    let newArr: BussinesEnquiryProductType[] = []
    currentRow.map((item) => {
      item.id = Math.random().toString()
      if (
        dataSource.find((el) => el.productName !== item.productName) ||
        !dataSource.length
      ) {
        newArr.push(item)
      }
    })
    setDataSource(newArr)
    setSelectProduct({ visible: false, selected: null })
    console.log(currentRow, 'currentRow', dataSource, newArr)
  }

  const onEditOk = (customerRow: ProductManageType) => {
    console.log(customerRow, 'currentRow')
    dataSource.unshift(customerRow)
    setModalShow(false)
  }

  const confirmEditQuotation = (info: { modifyReason: string }) => {
    console.log(info, 'message')
    setEditQuotationVisible(false)
  }

  const confirmAudit = () => {}

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
        <p className="font-semibold">询价图片</p>
        <div className="w-full h-[320px] mt-[12px] bg-gray-100">
          <img src="" className="h-full w-[347px] mx-auto" alt="" />
        </div>
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
        <Table<BussinesEnquiryProductType>
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          rowKey={'id'}
          size="small"
          dataSource={dataSource}
          scroll={{ x: 'max-content', y: 188 }}
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
        type="customizedProducts"
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
