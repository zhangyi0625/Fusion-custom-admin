import { useEffect, useState } from 'react'
import {
  ConfigProvider,
  Form,
  GetProp,
  Input,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import DragModal from '@/components/modal/DragModal'
import ImportIcon from '@/assets/svg/icon/import.svg'
import { postUploadFile } from '@/services/upload/UploadApi'
import { loadAnalysis } from './loadAnalysis'
import type { BussinesEnquiryImportType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

export type ImportEnquiryProps = {
  params: {
    visible: boolean
    isFirst: boolean
  }
  onOk: (params: Omit<BussinesEnquiryImportType, 'id'>) => void
  onCancel: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const ImportEnquiry: React.FC<ImportEnquiryProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, isFirst } = params

  const [form] = Form.useForm()

  const { Dragger } = Upload

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const [fileResults, setFileResults] = useState([])

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls',
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
            inquiryFile: resp.data.id,
          })
          console.log(form.getFieldsValue())

          // 解析xlsx内容
          loadAnalysis(info.file as FileType, setFileResults, 'ImportEnquiry')
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

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    setFileList([])
  }, [visible])

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        console.log(
          { ...form.getFieldsValue(), products: fileResults },
          'form.getFieldsValue()'
        )
        onOk({ ...form.getFieldsValue(), products: fileResults })
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
      title="上传询价表"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 3 }}>
        <Form.Item name="inquiryFile" hidden>
          <Input disabled />
        </Form.Item>
        {!isFirst && (
          <Form.Item
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
          </Form.Item>
        )}
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
            仅支持文件格式：xlsx
          </p>
        </Dragger>
      </ConfigProvider>
    </DragModal>
  )
}

export default ImportEnquiry
