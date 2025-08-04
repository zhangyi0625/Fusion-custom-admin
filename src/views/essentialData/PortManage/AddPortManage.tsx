import React, { useEffect, useState } from 'react'
import { Checkbox, Form, Input, Radio, Select, Space } from 'antd'
import { SelectProps } from 'antd/lib'
import DragModal from '@/components/modal/DragModal'
import {
  getPortCountryManageList,
  getPortRouteManageList,
} from '@/services/essential/portManage/portManageModel'
import type { PortManageType } from '@/services/essential/portManage/portManageApi'
import { PortSettingSelect } from './config'

export type AddPortManageProps = {
  params: {
    visible: boolean
    currentRow: PortManageType
    view: boolean
  }
  onOk: (params: PortManageType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

type SelectParams = {
  country: SelectProps['options']
  route: SelectProps['options']
}

const AddPortManage: React.FC<AddPortManageProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params

  const [form] = Form.useForm()

  const [loading, setLoading] = useState<boolean>(false)

  const [selectOptions, setSelectOptions] = useState<SelectParams>({
    country: [],
    route: [],
  })

  const [port, setPort] = useState<string[]>([])

  const [secondRoute, setSecondRoute] = useState([] as SelectProps['options'])

  useEffect(() => {
    if (!visible) return
    init()
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        isPopularity: Number(currentRow.isPopularity),
        enabled: Number(currentRow.enabled),
        countryId: Number(currentRow.countryId),
      })
      currentRow.isFnd && setPort(['isFnd'])
      currentRow.isPor && setPort(port.concat(['isPor']))
    } else {
      form.resetFields()
      form.setFieldsValue({ isPopularity: 1, enabled: 1 })
      setPort([])
    }
  }, [visible, view])

  const init = () => {
    setLoading(true)
    Promise.all([getPortRouteManageList(), getPortCountryManageList()])
      .then((result) => {
        setSelectOptions({ route: result[0], country: result[1] })
        // 回显二级航线
        getFirstRouteChange(
          form.getFieldValue('routeParentCode'),
          false,
          result[0]
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const getFirstRouteChange = (
    e: string,
    isReset: boolean,
    result?: SelectProps['options']
  ) => {
    isReset && form.setFieldsValue({ routeId: null })
    let filterArr = (result ?? selectOptions.route)?.filter(
      (item) => String(item.parentCode) === e.toString()
    )
    setSecondRoute(filterArr)
  }

  const getChildren = (arr: SelectProps['options']) => {
    return arr?.filter((item) => !item.parentId)
  }

  const checkboxChange = (e: string[]) => {
    setPort(e)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let info = {
          isPor: Number(port.includes('isPor')),
          isFnd: Number(port.includes('isFnd')),
        }
        onOk({ ...form.getFieldsValue(), ...info })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      width="40%"
      open={visible}
      title={currentRow ? '编辑港口' : '新增港口'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="code"
          label="港口编码"
          rules={[
            {
              required: true,
              message: '请输入港口编码',
            },
          ]}
        >
          <Input placeholder="请输入航线名称" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="cnName"
          label="港口中文名"
          rules={[
            {
              required: true,
              message: '请输入港口中文名',
            },
          ]}
        >
          <Input placeholder="请输入港口中文名" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="enName"
          label="港口英文名"
          rules={[
            {
              required: true,
              message: '请输入港口英文名',
            },
          ]}
        >
          <Input placeholder="请输入港口英文名" allowClear autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="countryId"
          label="所属国家"
          rules={[
            {
              required: true,
              message: '请选择所属国家',
            },
          ]}
        >
          <Select
            showSearch
            options={selectOptions.country}
            allowClear
            fieldNames={{ label: 'cnName', value: 'id' }}
            placeholder="请选择所属国家"
          ></Select>
        </Form.Item>
        <Form.Item label="所属航线" style={{ marginBottom: 0 }}>
          <Space>
            <Form.Item
              name="routeParentCode"
              rules={[
                {
                  required: true,
                  message: '请选择一级航线',
                },
              ]}
            >
              <Select
                showSearch
                options={(getChildren(selectOptions.route) || []).map(
                  (item) => ({
                    label: item.name,
                    value: item.code,
                  })
                )}
                allowClear
                style={{ width: '200px' }}
                placeholder="请选择一级航线"
                onChange={(e) => getFirstRouteChange(e, true)}
              ></Select>
            </Form.Item>
            <Form.Item
              name="routeCode"
              rules={[
                {
                  required: true,
                  message: '请选择二级航线',
                },
              ]}
            >
              <Select
                showSearch
                allowClear
                options={secondRoute}
                fieldNames={{ label: 'name', value: 'code' }}
                style={{ width: '200px' }}
                placeholder="请选择二级航线"
              ></Select>
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="标签">
          <Checkbox.Group
            options={PortSettingSelect['isPort']}
            value={port}
            onChange={checkboxChange}
          />
        </Form.Item>
        <Form.Item
          name="isPopularity"
          label="热门港口"
          rules={[
            {
              required: true,
              message: '请选择是否热门港口',
            },
          ]}
        >
          <Radio.Group options={PortSettingSelect['whether']} />
        </Form.Item>
        <Form.Item
          name="enabled"
          label="状态"
          rules={[
            {
              required: true,
              message: '请选择状态',
            },
          ]}
        >
          <Radio.Group options={PortSettingSelect['enabled']} />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default AddPortManage
