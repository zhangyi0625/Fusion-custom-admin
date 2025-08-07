import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import DragModal from '@/components/modal/DragModal'
import {
  App,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputRef,
  Radio,
  RadioChangeEvent,
  Space,
  Table,
  TableProps,
} from 'antd'
import { debounce, sum } from 'lodash-es'
import { getSaleProjectQuotation } from '@/services/projectManage/SaleProject/SaleProjectApi'
import { MakeQuotationTableType } from '@/services/projectManage/SaleProject/SaleProjectModel'
import { CheckboxGroupProps } from 'antd/es/checkbox'

export type MakeQuotationModalProps = {
  params: {
    visible: boolean
  }
  onOk: (params: any) => void
  onCancel: () => void
}

type ColumnTypes = Exclude<
  TableProps<MakeQuotationTableType>['columns'],
  undefined
>

interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof MakeQuotationTableType
  record: MakeQuotationTableType
  handleSave: (record: MakeQuotationTableType) => void
}

interface InputNumberValType {
  price: number | string
  sumPrice: number | string
}

const EditableContext =
  React.createContext<FormInstance<MakeQuotationTableType> | null>(null)

const MakeQuotationModal: React.FC<MakeQuotationModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible } = params

  const { message } = App.useApp()

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  const [radioDefaultValue, setRadioDefaultValue] = useState<string | null>(
    null
  )

  const [inputNumberVal, setInputNumberVal] = useState<InputNumberValType>({
    price: 0,
    sumPrice: 0,
  })

  useEffect(() => {
    if (!visible) return
    loadQuotation()
  }, [visible])

  const [quotationData, setQuotationData] = useState<MakeQuotationTableType[]>(
    []
  )

  const loadQuotation = async () => {
    const res = await getSaleProjectQuotation()
    let newData = res.map((item: MakeQuotationTableType) => {
      return {
        ...item,
        changePrice: item.price,
        changePriceSum: Number(item.pricesSum).toFixed(1),
      }
    })
    setQuotationData(newData)
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
      title: '规格或型号',
      key: 'name',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '数量',
      key: 'count',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '产品单价(元)',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: 150,
    },
    {
      title: '产品金额(元)',
      key: 'pricesSum',
      dataIndex: 'pricesSum',
      align: 'center',
      width: 150,
    },
    {
      title: '调整后单价(元)',
      key: 'changePrice',
      dataIndex: 'changePrice',
      align: 'center',
      width: 150,
      editable: true,
    },
    {
      title: '调整后金额(元)',
      key: 'changePriceSum',
      dataIndex: 'changePriceSum',
      width: 150,
      align: 'center',
    },
  ]

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: MakeQuotationTableType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })
  const handleSave = (row: MakeQuotationTableType) => {
    const newData = [...quotationData]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setQuotationData(newData)
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
        handleSave({
          ...record,
          ...values,
          changePriceSum: (record.count * Number(values.changePrice)).toFixed(
            1
          ),
        })
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
          // rules={[{ required: true, message: `${title} is required.` }]}
        >
          <Input
            type="number"
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
          {/* <InputNumber min={0} ref={inputRef} onPressEnter={save}  /> */}
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

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const searchValueChange = debounce((value: any) => {
    console.log(value)
  }, 300)

  const onConfirm = () => {}

  const rowSelection: TableProps['rowSelection'] = {
    selectedRowKeys,
    onChange(selectedRowKeys) {
      setSelectedRowKeys(selectedRowKeys as string[])
    },
  }

  const getSum = useMemo(() => {
    const value = quotationData.reduce(
      (total: number, item: MakeQuotationTableType) => {
        return total + Number(item.pricesSum)
      },
      0
    )
    return value.toFixed(1)
  }, [quotationData])

  const getChangeSum = useMemo(() => {
    const sum = quotationData.reduce(
      (total: number, item: MakeQuotationTableType) => {
        return total + Number(item.changePriceSum)
      },
      0
    )
    return sum.toFixed(1)
  }, [quotationData])

  const adjustPrice = () => {
    if (!radioDefaultValue) {
      message.error('至少选择一种方式进行调价！')
    } else {
      const newData = [...quotationData].map((item) => {
        return {
          ...item,
          changePrice: item.price,
          changePriceSum: item.pricesSum,
        }
      })
      // 清空所有调整后的单价和总价
      setQuotationData(newData)
      let unselectedSum = 0
      let selectedSum = 0
      let half = 1
      newData.map((item) => {
        if (radioDefaultValue === 'price') {
          if (selectedRowKeys.includes(item.id)) return
          // 非锁定行单价上调
          item.changePrice = (
            Number(item.price) +
            Number(item.price) * (Number(inputNumberVal.price) / 100)
          ).toFixed(2)
          item.changePriceSum = (item.count * Number(item.changePrice)).toFixed(
            1
          )
        } else {
          // 非锁定行分摊总价
          if (selectedRowKeys.includes(item.id)) {
            unselectedSum += Number(item.pricesSum)
          } else selectedSum += Number(item.pricesSum)
          half = Number(
            (
              (Number(inputNumberVal.sumPrice) - unselectedSum) /
              selectedSum
            ).toFixed(3)
          )
        }
      })
      radioDefaultValue === 'sumPrice' &&
        newData.map((item) => {
          item.changePrice = (Number(item.price) * half).toFixed(2)
          item.changePriceSum = (item.count * Number(item.changePrice)).toFixed(
            1
          )
        })
      setQuotationData(newData)
    }
  }

  const resetPrice = () => {
    setRadioDefaultValue(null)
    setInputNumberVal({ price: 0, sumPrice: 0 })
    loadQuotation()
  }

  const optionsWithDisabled: CheckboxGroupProps<string>['options'] = [
    {
      label: (
        <div className="flex items-center">
          <p className="mr-[8px]">非锁定行单价上调%</p>
          <InputNumber
            min={0}
            style={{ width: '180px' }}
            addonBefore="+"
            addonAfter="%"
            defaultValue={0}
            value={inputNumberVal.price}
            onChange={(e: any) =>
              setInputNumberVal({ ...inputNumberVal, price: e })
            }
          />
        </div>
      ),
      value: 'price',
    },
    {
      label: (
        <div className="flex items-center">
          <p className="mr-[20px]">非锁定行分摊总价</p>
          <InputNumber
            min={getSum}
            style={{ width: '180px' }}
            value={inputNumberVal.sumPrice}
            onChange={(e: any) =>
              setInputNumberVal({ ...inputNumberVal, sumPrice: e })
            }
          />
          <Space>
            <Button onClick={adjustPrice} type="primary" className="ml-[70px]">
              调价
            </Button>
            <Button onClick={resetPrice} type="default">
              重置
            </Button>
          </Space>
        </div>
      ),
      value: 'sumPrice',
    },
  ]

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setRadioDefaultValue(value)
  }

  const close = () => {
    setSelectedRowKeys([])
    setRadioDefaultValue(null)
    setInputNumberVal({ price: 0, sumPrice: 0 })
    onCancel()
  }

  const onPreview = () => {}

  const downloadEnquiry = () => {}

  return (
    <DragModal
      width="80%"
      open={visible}
      title="制作报价"
      onOk={onConfirm}
      onCancel={close}
      footer={
        <Space>
          <Button type="primary" onClick={onConfirm}>
            保存
          </Button>
          <Button type="primary" onClick={onPreview}>
            预览
          </Button>
          <Button
            type="primary"
            onClick={downloadEnquiry}
            variant="solid"
            color="orange"
          >
            生成报价表
          </Button>
        </Space>
      }
    >
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
        dataSource={quotationData}
        scroll={{ x: 'max-content', y: 188 }}
        columns={mergedColumns as ColumnTypes}
        pagination={false}
        rowSelection={rowSelection}
      />
      <div className="w-full">
        <div className="bg-white h-[50px] leading-[50px] flex items-center justify-end text-stone-900">
          <div className="">
            <span className="font-semibold">产品总金额</span>
            <span className="text-red-500 ml-[60px]">{getSum}</span>
          </div>
          <div className="mx-[60px]">
            <span className="font-semibold">调整后总金额</span>
            <span className="text-red-500 ml-[60px]">{getChangeSum}</span>
          </div>
        </div>
        <div className="h-[128px] p-[24px]" style={{ background: '#F0F4FA' }}>
          <div className="flex items-start">
            <p className="text-stone-900 mt-[4px]">
              选择一种调价方式调整价格：
            </p>
            <Radio.Group
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
              options={optionsWithDisabled}
              onChange={onChange}
              value={radioDefaultValue}
            />
          </div>
        </div>
      </div>
    </DragModal>
  )
}

export default MakeQuotationModal
