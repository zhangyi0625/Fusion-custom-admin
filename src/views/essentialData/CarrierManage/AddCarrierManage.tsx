import {
  App,
  Form,
  GetProp,
  Input,
  Radio,
  Select,
  Upload,
  UploadProps,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import DragModal from '@/components/modal/DragModal'
import type { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel'
import { CarrierManageForm } from './config'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
// import { postUploadFile } from '@/services/Upload/UploadApi'

export type AddCarrierManageProps = {
  params: {
    visible: boolean
    currentRow: CarrierManageType
    view: boolean
  }
  onOk: (params: CarrierManageType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AddCarrierManage: React.FC<AddCarrierManageProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params

  const { message } = App.useApp()

  const [form] = Form.useForm()

  const [initialValues, setInitialValues] = useState({})

  const [fileList, setFileList] = useState<any>([])

  const [imageUrl, setImageUrl] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        enabled: Number(currentRow.enabled),
      })
      setImageUrl(currentRow.logoUrl ?? '')
    } else {
      form.resetFields()
      setInitialValues({ enabled: 1 })
      form.setFieldsValue({ enabled: 1 })
      setImageUrl('')
      setLoading(false)
    }
  }, [visible, view])

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue(), logoUrl: imageUrl })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  )

  const CustomeUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    listType: 'picture-card',
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
      }
      return false
    },
    onChange(info) {
      setLoading(true)
      // const formdata = new FormData()
      // formdata.append('file', info.file as FileType) //将每一个文件图片都加进formdata
      // postUploadFile(formdata).then((resp) => {
      //   setLoading(false)
      //   setImageUrl(resp.data)
      // })
    },
    onRemove() {
      setImageUrl('')
    },
    fileList,
  }

  return (
    <DragModal
      width="40%"
      open={visible}
      title={currentRow ? '编辑船司' : '新增船司'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} initialValues={initialValues}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {CarrierManageForm.map((item) => (
          <Form.Item
            label={item.label}
            key={item.name}
            name={item.name}
            rules={[
              {
                required: true,
                message: `请${item.formType === 'input' ? '输入' : '选择'}${
                  item.label
                }`,
              },
            ]}
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
            {item.formType === 'upload' && (
              <Upload {...CustomeUploadProps}>
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  )
}

export default AddCarrierManage
