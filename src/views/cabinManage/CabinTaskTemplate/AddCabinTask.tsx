import { CloseOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
} from 'antd'
import React, { memo, useCallback, useEffect } from 'react'
import { getTemplateSetting } from './columns'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import { formatTime } from '@/utils/format'
import { filterKeys } from '@/utils/tool'
import type { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'

export type AddCabinTaskProps = {
  params: {
    visible: boolean
    currentRow: null
    view: boolean
  }
  carrier: string
  onOk: (params: any) => void
  onCancel: () => void
}

const AddCabinTask: React.FC<AddCabinTaskProps> = memo(
  ({ params, carrier, onOk, onCancel }) => {
    const { visible, currentRow, view } = params

    const [form] = Form.useForm()

    const ctnTypeOptions = ['20GP', '40GP', '40HQ', '45HQ']

    const essential = useSelector((state: RootState) => state.essentail)

    const otherFormItem = useCallback(() => {
      return getTemplateSetting()['formSetting'][carrier] ?? []
    }, [])

    useEffect(() => {
      if (!visible) return
      if (!currentRow) form.resetFields()
    }, [visible])

    const onConfirm = () => {
      form
        .validateFields()
        .then(() => {
          let params = {
            ...filterKeys(
              form.getFieldsValue(),
              ['contractNo', 'extentDndFreeDays', 'withRollable'],
              false
            ),
            etd: formatTime(form.getFieldValue('etd'), 'Y-M-D'),
            extra: {
              ...filterKeys(
                form.getFieldsValue(),
                ['contractNo', 'extentDndFreeDays', 'withRollable'],
                true
              ),
            },
          }
          onOk(params)
        })
        .catch((errorInfo) => {
          // 滚动并聚焦到第一个错误字段
          form.scrollToField(errorInfo.errorFields[0].name)
          form.focusField(errorInfo.errorFields[0].name)
        })
    }
    return (
      <Drawer
        title="创建任务"
        width={736}
        open={visible}
        closeIcon={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
        }
        onClose={onCancel}
        classNames={{ footer: 'text-right' }}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={onConfirm}>
              确定
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          initialValues={{
            ctnTicket: 0,
            ctnQty: 0,
            withRollable: true,
            extentDndFreeDays: 0,
          }}
        >
          <div className="bg-normal-blue font-medium rounded-[2px] text-white w-full px-[12px] py-[6px] mb-[20px]">
            订舱信息
          </div>
          <Form.Item
            label="起运港"
            name="porCode"
            rules={[
              {
                required: true,
                message: '请输入起运港',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="请输入起运港"
              showSearch
              options={(essential.porPortData || []).map(
                (item: { code: string; enName: string; cnName: string }) => ({
                  label: item.enName + '-' + item.cnName,
                  value: item.code,
                })
              )}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="目的港"
            name="fndCode"
            rules={[
              {
                required: true,
                message: '请输入目的港',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="请输入目的港"
              showSearch
              options={(essential.fndPortData || []).map(
                (item: { code: string; enName: string; cnName: string }) => ({
                  label: item.enName + '-' + item.cnName,
                  value: item.code,
                })
              )}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="ETD"
            name="etd"
            rules={[
              {
                required: true,
                message: '请选择预计开航日期',
              },
            ]}
          >
            <DatePicker
              placeholder="请选择预计开航日期"
              style={{ width: '100%' }}
              showTime={{ format: 'YYYY-MM-DD' }}
            />
          </Form.Item>
          <Form.Item
            label="订舱客户"
            name="customerId"
            rules={[
              {
                required: true,
                message: '请输入订舱客户',
              },
            ]}
          >
            <Select
              allowClear
              placeholder="请输入订舱客户"
              showSearch
              options={(essential.customerData || []).map(
                (item: CustomerManageType) => ({
                  label: item.name,
                  value: item.id,
                })
              )}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item label="箱型" style={{ marginBottom: 0 }}>
            <Space>
              <Form.Item
                name="ctnType"
                rules={[
                  {
                    required: true,
                    message: '请选择箱型',
                  },
                ]}
              >
                <Select
                  options={ctnTypeOptions.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  filterOption
                  style={{ width: '200px' }}
                  placeholder="请选择箱型"
                ></Select>
              </Form.Item>
              <Form.Item label="票数" name="ctnTicket">
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item label="每票箱数" name="ctnQty">
                <InputNumber min={0} />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item
            label="价格上限"
            name="priceLimit"
            rules={[
              {
                required: true,
                message: '请输入单箱价格上限',
              },
            ]}
          >
            <Input addonAfter={'USD'} placeholder="请输入单箱价格上限" />
          </Form.Item>
          <div className="bg-blue-500 font-medium rounded-[2px] text-white w-full my-[20px] px-[12px] py-[6px]">
            {carrier}订舱要求
          </div>
          {otherFormItem().map((item) => (
            <Form.Item
              key={item.name}
              label={item.label}
              name={item.name}
              rules={
                item.isRules
                  ? [
                      {
                        required: true,
                        message: `请选择${item.label}`,
                      },
                    ]
                  : []
              }
            >
              {item.formType === 'inputNumber' && (
                <InputNumber min={0} style={{ width: '200px' }} />
              )}
              {item.formType === 'input' && (
                <Input placeholder={item.label} allowClear />
              )}
              {item.formType === 'radio' && (
                <Radio.Group
                  options={
                    item.options as CheckboxGroupProps<string>['options']
                  }
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </Drawer>
    )
  }
)

export default AddCabinTask
