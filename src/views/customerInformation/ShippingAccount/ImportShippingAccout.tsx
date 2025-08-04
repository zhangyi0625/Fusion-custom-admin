import React, { useEffect, useState } from 'react'
import {
  ConfigProvider,
  Form,
  GetProp,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import DragModal from '@/components/modal/DragModal'
import type { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'
import type { ShippingAccounType } from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import { ImportShippingAccountByXLSX } from './import'

export type ImportShippingAccoutProps = {
  visible: boolean
  title: string
  options?: CustomerManageType[] | any[]
  type: 'importShippingAccount' | 'importCabinTask'
  onOk: (params: Record<string, string | number | boolean>) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const ImportShippingAccout: React.FC<ImportShippingAccoutProps> = ({
  visible,
  type,
  options,
  title,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

  const { Dragger } = Upload

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [fileResults, setFileResults] = useState<
    Omit<ShippingAccounType, 'id'>[]
  >([])

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    beforeUpload(file) {
      setFileList([file])
      return false
    },
    onChange(info) {
      ImportShippingAccountByXLSX(info.file as FileType, setFileResults, type)
    },
    fileList,
  }

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    setFileList([])
    setFileResults([])
  }, [visible])

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let map = fileResults.map((item) => {
          return {
            ...item,
            customerId: form.getFieldValue('customerId'),
          }
        })
        onOk(map as Omit<ShippingAccounType, 'id'>[] as any)
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      open={visible}
      width={'40%'}
      title={title}
      onOk={handleOk}
      onCancel={onCancel}
      okText="导入"
    >
      <Form form={form} labelCol={{ span: 4 }}>
        {type === 'importShippingAccount' && (
          <Form.Item
            label="客户名称"
            name="customerId"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Select
              allowClear
              placeholder="请输入客户名称"
              showSearch
              options={options}
              fieldNames={{ label: 'name', value: 'id' }}
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}
        {type === 'importCabinTask' && (
          <div className="underline text-blue-500 text-sm cursor-pointer mb-[20px]">
            下载MSK抢舱模版
          </div>
        )}
        <ConfigProvider
          theme={{
            components: {
              Upload: {
                colorBorder: '#167fff',
                colorFillAlter: 'rgba(241,246,255,1)',
              },
            },
          }}
        >
          <Dragger {...DraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sky-600">点击或将文件拖动到这里上传</p>
            <p>仅支持文件格式：xlsx</p>
          </Dragger>
        </ConfigProvider>
      </Form>
    </DragModal>
  )
}

export default ImportShippingAccout
