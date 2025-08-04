import { useEffect, useState } from 'react'
import style from '@/components/searchForm/index.module.scss'
import {
  Form,
  Select,
  Row,
  Col,
  Button,
  Space,
  Input,
  TableProps,
  DatePicker,
  SelectProps,
} from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import DragModal from '@/components/modal/DragModal'
import SearchTable from '@/components/searchTable'
import { getSearchPort, getShippingSchedule } from '@/services/order'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import { debounce } from 'lodash-es'
import dayjs from 'dayjs'

type ManualReleaseType = {
  params: {
    visible: boolean
    editRow: any
    carrierOptions?: string[]
  }
  onOk: (params: Record<string, string | number | boolean>) => void
  onCancel: () => void
}

type PortType = {
  POR?: SelectProps['options']
  FND?: SelectProps['options']
  [key: string]: SelectProps['options']
}

const transitionType: SelectProps['options'] = [
  {
    label: '直达',
    value: '0',
  },
  {
    label: '中转',
    value: '1',
  },
]

const fetchSearch = debounce(
  (
    value: { value?: string | undefined; tag: string },
    callback: (data: any) => void
  ) => {
    getSearchPort({ keyword: value.value, tag: value.tag }).then((res: any) => {
      callback({ [value.tag]: res })
    })
  },
  300
)

const ManualRelease: React.FC<ManualReleaseType> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, editRow, carrierOptions = [] } = params
  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)

  const [immediate, setImmediate] = useState<boolean>(true)

  const [selected, setSelected] = useState<string[]>([])

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  })

  const [defalueFormValue, setdefalueFormValue] = useState<{
    [key: string]: string
  }>({
    transshipment: '0',
    porCode: '',
    fndCode: '',
  })

  const columns: TableProps['columns'] = [
    {
      title: 'ETD',
      key: 'etd',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.etd, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: 'ETA',
      key: 'eta',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.eta, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '船名/航次',
      key: 'vesselName',
      align: 'center',
      width: 150,
      render(text) {
        return (
          <div>
            {text.vesselName} / {text.voyage}
          </div>
        )
      },
    },
    {
      dataIndex: 'routeCode',
      key: 'routeCode',
      title: '航线代码',
      align: 'center',
    },
    {
      title: '直达/中转',
      key: 'transferInfoList',
      align: 'center',
      width: 150,
      render(text) {
        return <div>{text.transferInfoList ? '中转' : '直达'}</div>
      },
    },
    {
      dataIndex: 'totalDuration',
      key: 'totalDuration',
      title: '航程',
      align: 'center',
    },
  ]

  const handleSearch = (newVal: string, tag: string) => {
    fetchSearch({ value: newVal, tag: tag }, setDefaultOptions)
  }

  const selectFoucs = (tag: string) => {
    let { porCode = '', fndCode = '' } = form.getFieldsValue()
    ;(!porCode || !fndCode) && fetchSearch({ tag: tag }, setDefaultOptions)
    console.log(defalueOptions, form.getFieldsValue())
  }

  useEffect(() => {
    if (!visible) return
    init()
  }, [visible])

  const init = () => {
    setLoading(true)
    // 初始化form
    form.resetFields()
    let info = filterKeys(
      editRow,
      ['carrier', 'etd', 'voyageNo', 'vesselName', 'remark'],
      true
    )
    // Todo：porInfo 和 fndInfo 渲染问题 暂时通过此方法回显数据
    let porInfo: DefaultOptionType[] | undefined = []
    getSearchPort({ keyword: editRow.porName.split(',')[0], tag: 'POR' }).then(
      (res: any) => {
        // setDefaultOptions({ POR: res } as unknown as PortType)
        porInfo = res ?? []
        form.setFieldsValue({
          ...info,
          porCode: res[0]?.unlocode ?? '',
          etd: dayjs(info.etd) ?? '',
        })
      }
    )
    setTimeout(() => {
      getSearchPort({
        keyword: editRow.fndName.split(',')[0],
        tag: 'FND',
      }).then((res: any) => {
        setDefaultOptions({
          POR: porInfo,
          FND: res,
        } as unknown as PortType)
        form.setFieldsValue({
          fndCode: res[0]?.unlocode ?? '',
        })
      })
      setLoading(false)
    }, 2000)
  }

  const handleOk = () => {
    console.log(form.getFieldsValue(), 'form')
  }

  const loadShippingSchedule = () => {
    setdefalueFormValue(form.getFieldsValue())
    setImmediate(false)
  }

  const getPortSelect = (type: string) => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={(value: string) => handleSearch(value, type)}
        onFocus={() => selectFoucs(type)}
        classNames={{
          popup: {
            root: 'portSelect',
          },
        }}
        options={(defalueOptions[type] || []).map((item) => ({
          label: (
            <div className="">
              <p>
                {item.localName} - {item.name}
              </p>
              <p>
                {item.countryLocalName} - {item.countryName}
              </p>
            </div>
          ),
          value: item.unlocode,
        }))}
      />
    )
  }

  const cancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <DragModal
      open={visible}
      width={'60%'}
      title="手动发布"
      onOk={handleOk}
      onCancel={cancel}
      okText="发布"
      loading={loading}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        initialValues={defalueFormValue}
        className={style['search-form']}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="起运港" name="porCode">
              {getPortSelect('POR')}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="目的港" name="fndCode">
              {getPortSelect('FND')}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="船公司" name="carrier">
              <Select
                allowClear
                placeholder="请选择船公司"
                showSearch
                defaultActiveFirstOption={false}
                filterOption={false}
                options={carrierOptions.map((d) => ({
                  value: d,
                  label: d,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="船名">
              <Space>
                <Form.Item
                  noStyle
                  name="vesselName"
                  rules={[{ required: true, message: '请输入船名' }]}
                >
                  <Input
                    autoFocus={false}
                    allowClear
                    autoComplete="off"
                    placeholder="请输入船名"
                  />
                </Form.Item>
                <Button type="primary" onClick={loadShippingSchedule}>
                  获取船期
                </Button>
              </Space>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="航次"
              name="voyageNo"
              rules={[{ required: true, message: '请输入航次' }]}
            >
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入航次"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="直达/中转"
              name="transshipment"
              rules={[{ required: true, message: '请选择直达/中转' }]}
            >
              <Select
                allowClear
                placeholder="请选择直达/中转"
                showSearch
                defaultActiveFirstOption={false}
                filterOption={false}
                options={transitionType}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ETD"
              name="etd"
              rules={[{ required: true, message: '请选择ETD' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime={{ format: 'YYYY-MM-DD' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ETA"
              name="eta"
              rules={[{ required: true, message: '请选择ETA' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="航程"
              name="etaEtdDay"
              rules={[{ required: true, message: '请输入航程' }]}
            >
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入航程"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="remark">
              <Input
                autoFocus={false}
                allowClear
                autoComplete="off"
                placeholder="请输入备注"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <SearchTable
        columns={columns}
        rowKey="id"
        fetchData={getShippingSchedule}
        searchFilter={filterKeys(
          defalueFormValue,
          ['porCode', 'fndCode', 'carrier'],
          true
        )}
        isSelection={true}
        isPagination={false}
        immediate={immediate}
        onUpdatePagination={() => {
          return
        }}
        onUpdateSelection={(options: string[]) => setSelected(options)}
      />
    </DragModal>
  )
}

export default ManualRelease
