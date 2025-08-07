import React, { useContext, useRef } from 'react'
import { memo, useEffect, useState } from 'react'
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Space,
  Table,
  TableProps,
} from 'antd'
import { debounce } from 'lodash-es'
import ProductTransfer from '../../ProductTransfer'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import ImportProduct from '../../ImportProduct'

export type EnquiryProductProps = {}

type ColumnTypes = Exclude<TableProps<any>['columns'], undefined>

interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof any
  record: any
  handleSave: (record: any) => void
}

const EditableContext = React.createContext<FormInstance<any> | null>(null)

const EnquiryProductCom: React.FC<EnquiryProductProps> = memo(() => {
  const [dataSource, setDataSource] = useState<any[]>([])

  const [params, setParams] = useState<{
    visible: boolean
    selected: string[] | null
  }>({
    visible: false,
    selected: null,
  })

  const [importModal, setImportModal] = useState({
    visible: false,
    source: 'BusinessEnquiry',
  })

  useEffect(() => {
    loadEnquiryProduct()
  }, [])

  const loadEnquiryProduct = async () => {
    const res = await getBusinessEnquiryListPage({} as any)
    setDataSource(res.data.data)
  }

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
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
      key: 'projectType',
      dataIndex: 'projectType',
      align: 'center',
      editable: true,
    },
    {
      title: '规格型号',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '单位',
      key: 'payType',
      dataIndex: 'payType',
      align: 'center',
    },
    {
      title: '采购数量',
      key: 'payType',
      align: 'center',
    },
    {
      title: '排序',
      key: 'payType',
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
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const searchValueChange = debounce((value: any) => {
    console.log(value)
  }, 300)

  const deleteItem = (id: string) => {}

  const downloadTable = () => {}

  const importProduct = () => {}

  const importSuccess = () => {}

  return (
    <>
      <div className="flex items-center justify-between">
        <Input.Search
          placeholder="请输入产品名称/规格型号"
          onChange={(e) => searchValueChange(e.target.value)}
          style={{ width: '272px' }}
        />
        <div>
          <Space>
            <Button onClick={downloadTable} type="default">
              下载询价表
            </Button>
            <Button
              onClick={() =>
                setImportModal({ visible: true, source: 'BusinessEnquiry' })
              }
              type="default"
            >
              导入产品
            </Button>
            <Button
              onClick={() => setParams({ visible: true, selected: null })}
              type="primary"
            >
              选择产品
            </Button>
          </Space>
        </div>
      </div>
      <div
        style={{ background: '#fafafa' }}
        className="h-[54px] leading-[54px] w-full mt-[8px] flex items-center px-[12px]"
      >
        <p className="text-sm text-gray-600">
          <span className="text-red-400">*</span>
          铜价：
        </p>
        <Input
          placeholder="请输入当前铜价/规格型号"
          onChange={(e) => searchValueChange(e.target.value)}
          style={{ width: '240px' }}
        />
      </div>
      <Table<any>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        rowKey={'id'}
        dataSource={dataSource}
        columns={mergedColumns as ColumnTypes}
      />
      <ProductTransfer
        params={params}
        onCancel={() => setParams({ visible: false, selected: null })}
        onOk={(newArr: string[]) =>
          setParams({ visible: false, selected: newArr })
        }
      />
      <ImportProduct
        params={importModal}
        onCancel={() =>
          setImportModal({ visible: false, source: 'BusinessEnquiry' })
        }
        onOk={importSuccess}
      />
    </>
  )
})

export default EnquiryProductCom
