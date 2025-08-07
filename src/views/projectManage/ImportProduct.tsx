import { useEffect, useState } from 'react'
import { ConfigProvider, Upload, UploadFile, UploadProps } from 'antd'
import DragModal from '@/components/modal/DragModal'
import ImportIcon from '@/assets/svg/icon/import.svg'

export type ImportProductProps = {
  params: {
    visible: boolean
    source?: string
  }
  onOk: (params: any) => void
  onCancel: () => void
}

const ImportProduct: React.FC<ImportProductProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, source } = params

  const { Dragger } = Upload

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    beforeUpload(file) {
      setFileList([file])
      return false
    },
    onChange(info) {
      console.log(info, 'info')
      if (info.file.status !== 'uploading') {
        !info.fileList.length && setFileList([])
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
    setFileList([])
  }, [visible])

  const onConfirm = () => {}

  return (
    <DragModal
      width="40%"
      open={visible}
      title="导入产品"
      onOk={onConfirm}
      onCancel={onCancel}
    >
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

export default ImportProduct
