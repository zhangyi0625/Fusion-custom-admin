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
import { BussinesEnquiryProductType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

export type EnquiryHallDrawerProps = {
  params: {
    visible: boolean
    detailId: string | null
  }
  onOk: (params: any) => void
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

const EnquiryHallDrawer: React.FC<EnquiryHallDrawerProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, detailId } = params

  const [dataSource, setDataSource] = useState<BussinesEnquiryProductType[]>([])

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
      title: '型号-电压等级-规格',
      key: 'productName',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '单位',
      key: 'productUnit',
      dataIndex: 'productUnit',
      align: 'center',
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
    },
    {
      title: '产品单价',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      editable: true,
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
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  return (
    <Drawer
      title="我要报价"
      width={912}
      open={visible}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onCancel}>
            提交报价
          </Button>
        </Space>
      }
      footer={
        <div
          style={{
            boxShadow: '0px -1px 12px 0px rgba(0,0,0,0.12)',
            padding: 0,
          }}
          className="font-semibold pr-[30px] h-[51px] flex items-center justify-end"
        >
          <span>报价总金额</span>
          <span className="text-red-500 ml-[14px]">9410</span>
        </div>
      }
    >
      <Table<BussinesEnquiryProductType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        rowKey={'id'}
        size="small"
        dataSource={dataSource}
        scroll={{ x: 'max-content', y: 698 }}
        columns={mergedColumns as ColumnTypes}
        pagination={false}
      />
    </Drawer>
  )
}

export default EnquiryHallDrawer
