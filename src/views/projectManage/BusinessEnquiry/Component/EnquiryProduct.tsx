import React, { useContext, useRef, memo, useEffect, useState } from 'react'
import {
  App,
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Space,
  Table,
  TableProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  batchBusinessEnquiryProduct,
  deleteBusinessEnquiryProduct,
  downloadBusinessProject,
  getBusinessEnquiryProduct,
  putBusinessEnquiryProduct,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import type { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import ProductTransfer from '../../ProductTransfer'
import ImportProduct from '../../ImportProduct'
import { debounce } from 'lodash-es'

export type EnquiryProductProps = {
  projectId: string
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

const EnquiryProductCom: React.FC<EnquiryProductProps> = memo(
  ({ projectId }) => {
    const { modal, message } = App.useApp()

    const [dataSource, setDataSource] = useState<any[]>([])

    const [params, setParams] = useState<{
      visible: boolean
      selected: BussinesEnquiryProductType[] | null
    }>({
      visible: false,
      selected: null,
    })
    const [searchValue, setSearchValue] = useState<string>('')

    const [importModal, setImportModal] = useState<{
      visible: boolean
      source: 'BusinessEnquiry'
    }>({
      visible: false,
      source: 'BusinessEnquiry',
    })

    const [copperPrice, setCopperPrice] = useState<string>('')

    useEffect(() => {
      console.log(projectId, 'projectId')

      projectId && loadEnquiryProduct()
    }, [projectId])

    const loadEnquiryProduct = async () => {
      const res = await getBusinessEnquiryProduct(projectId, {
        keyword: searchValue ?? null,
      })
      setDataSource(
        res.sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort)
      )
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

    const EditableCell: React.FC<
      React.PropsWithChildren<EditableCellProps>
    > = ({
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
        title: '排序',
        key: 'sort',
        dataIndex: 'sort',
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
      // const newData = [...dataSource]
      // const index = newData.findIndex((item) => row.id === item.id)
      // const item = newData[index]
      putBusinessEnquiryProduct(row).then(() => {
        message.success('修改成功')
        loadEnquiryProduct()
      })
      // newData.splice(index, 1, {
      //   ...item,
      //   ...row,
      // })
      // newData.sort((a, b) => a.sort - b.sort)
      // setDataSource(newData)
    }

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }

    const searchValueChange = debounce((value: string) => {
      setSearchValue(value)
    }, 300)

    const deleteItem = (id: string) => {
      modal.confirm({
        title: '删除询价产品',
        icon: <ExclamationCircleFilled />,
        content: '确定删除该询价产品吗？数据删除后将无法恢复！',
        onOk() {
          deleteBusinessEnquiryProduct(id).then(() => {
            loadEnquiryProduct()
          })
        },
      })
    }

    const downloadTable = () => {
      downloadBusinessProject(projectId).then((resp) => {
        let blobUrl = window.URL.createObjectURL(resp)
        const aElement = document.createElement('a')
        document.body.appendChild(aElement)
        aElement.style.display = 'none'
        aElement.href = blobUrl
        aElement.download = '下载询价表' + '.xlsx'
        aElement.click()
        document.body.removeChild(aElement)
      })
    }

    const importSuccess = () => {}

    const updateEnquiryProduct = async (
      currentRow: BussinesEnquiryProductType[]
    ) => {
      let params = {
        projectId: projectId,
        products: currentRow,
      }
      try {
        await batchBusinessEnquiryProduct(params)
        message.success('添加成功')
        // 操作成功，关闭弹窗，刷新数据
        setParams({ visible: false, selected: null })
        loadEnquiryProduct()
      } catch (error) {}
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <Input.Search
            placeholder="请输入产品名称"
            onChange={(e) => searchValueChange(e.target.value)}
            onSearch={() => loadEnquiryProduct()}
            style={{ width: '272px' }}
            allowClear
          />
          <div>
            <Space>
              <Button onClick={downloadTable} type="default">
                下载询价表
              </Button>
              {/* <Button
                onClick={() =>
                  setImportModal({ visible: true, source: 'BusinessEnquiry' })
                }
                type="default"
              >
                导入产品
              </Button> */}
              <Button
                onClick={() =>
                  setParams({ visible: true, selected: dataSource })
                }
                type="primary"
              >
                选择产品
              </Button>
            </Space>
          </div>
        </div>
        <div className="h-[54px] leading-[54px] w-full mt-[8px] flex items-center px-[12px] enquiry-product">
          <p className="text-sm text-gray-600">
            <span className="text-red-400">*</span>
            铜价：
          </p>
          <Input
            placeholder="请输入当前铜价"
            value={copperPrice}
            onChange={(e) => setCopperPrice(e.target.value)}
            style={{ width: '240px' }}
          />
        </div>
        <div className="editable-row">
          <Table<BussinesEnquiryProductType>
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            rowKey={'id'}
            size="small"
            dataSource={dataSource}
            scroll={{ x: 'max-content', y: 298 }}
            columns={mergedColumns as ColumnTypes}
            pagination={false}
          />
        </div>
        <ProductTransfer
          params={params}
          projectId={projectId}
          onCancel={() => setParams({ visible: false, selected: null })}
          onOk={updateEnquiryProduct}
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
  }
)

export default EnquiryProductCom
