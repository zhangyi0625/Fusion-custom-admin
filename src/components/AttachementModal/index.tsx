import React, { useEffect, useState } from 'react'
import DragModal from '../modal/DragModal'
import {
  ConfigProvider,
  Form,
  GetProp,
  Input,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { postUploadFile } from '@/services/upload/UploadApi'
import ImportIcon from '@/assets/svg/icon/import.svg'

export type AttachemntModalProps = {
  visible: boolean
  title: string
  uploadAccept: string[]
  uploadFileKey: string
  onOk: (params: any) => void
  onCancel: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AttachemntModal: React.FC<AttachemntModalProps> = ({
  visible,
  title = '添加附件',
  uploadAccept = ['.doc', 'docx'],
  uploadFileKey = 'fileId',
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm()

  const { Dragger } = Upload

  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!visible) return
    setFileList([])
    form.resetFields()
  }, [visible])

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: uploadAccept.join(','),
    beforeUpload(file) {
      setFileList([file])
      return false
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        !info.fileList.length && setFileList([])
      }
      if (info.fileList.length) {
        const formdata = new FormData()
        formdata.append('file', info.file as FileType) //将每一个文件图片都加进formdata
        postUploadFile(formdata).then((resp) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            // inquiryFile: resp.data.id,
            [uploadFileKey]: resp.data.id,
          })
        })
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    fileList,
  }

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue() })
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
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      wrapClassName="attachement-modal"
    >
      {/* {!isFirst && ( */}
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item name={uploadFileKey} hidden>
          <Input disabled />
        </Form.Item>
        {/* <Form.Item
            label="理由"
            name="reason"
            rules={[
              { required: true, message: '请输入你重新上传询价表的理由' },
            ]}
          >
            <Input.TextArea
              placeholder="请输入你重新上传询价表的理由"
              allowClear
            />
          </Form.Item> */}
        {/* )} */}
      </Form>
      <ConfigProvider
        theme={{
          components: {
            Upload: {
              colorBorder: 'rgba(0,0,0,0.15)',
              colorFillAlter: 'rgba(0,0,0,0)',
            },
          },
        }}
      >
        <Dragger {...DraggerProps}>
          <p className="ant-upload-drag-icon pt-[40px]">
            <img src={ImportIcon} className="w-[48px] h-[48px] m-auto" alt="" />
          </p>
          <p className="text-base">点击或将文件拖拽到这里上传</p>
          <p className="text-gray-500 text-sm mb-[40px]">
            {/* 仅支持文件格式：xlsx */}
            仅支持文件格式：{uploadAccept.join(',')}
          </p>
        </Dragger>
      </ConfigProvider>
    </DragModal>
  )
}

export default AttachemntModal
