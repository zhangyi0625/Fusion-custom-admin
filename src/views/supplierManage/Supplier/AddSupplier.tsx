import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  GetProp,
  Input,
  Row,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddSupplierForm } from '../config'
import type { SupplierType } from '@/services/supplierManage/Supplier/SupplierModel'
import { UploadOutlined } from '@ant-design/icons'
import { postUploadFile } from '@/services/upload'

export type AddSupplierProps = {
  params: {
    visible: boolean
    currentRow: SupplierType | null
  }
  onOk: (params: SupplierType) => void
  onCancel: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AddSupplier: React.FC<AddSupplierProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params

  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    if (currentRow) {
      form.setFieldsValue({ ...currentRow })
      setFileList([{ name: currentRow.logoName, uid: currentRow.logo }])
    } else {
      form.setFieldsValue({ status: 1 })
      setFileList([])
    }
  }, [visible])

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.png,.jpg',
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
            logo: resp.data.id,
            logoName: resp.data.name,
          })
        })
      }
    },
    fileList,
  }

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue(), status: 1 })
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
      title={currentRow ? '编辑供应商' : '新增供应商'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {AddSupplierForm.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                label={item.label}
                key={item.name}
                name={item.name}
                rules={
                  item.isRules
                    ? [
                        {
                          required: true,
                          message: `请${
                            item.formType === 'input' ? '输入' : '选择'
                          }${item.label}`,
                        },
                      ]
                    : undefined
                }
              >
                {item.formType === 'input' && (
                  <Input
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    allowClear
                  />
                )}
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item
              name={'logo'}
              label="logo"
              layout="horizontal"
              labelCol={{ span: 6 }}
              colon={false}
              rules={[
                {
                  required: true,
                  message: '请上传logo',
                },
              ]}
            >
              <Upload {...uploadProps}>
                <Button
                  color="primary"
                  variant="outlined"
                  icon={<UploadOutlined />}
                >
                  上传文件
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DragModal>
  )
}

export default AddSupplier
