import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  GetProp,
  Input,
  Row,
  Select,
  Space,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import DragModal from '@/components/modal/DragModal'
import { AddFollowRecordForm } from '../../config'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import { BussinesFollowRecordType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { postUploadFile } from '@/services/upload/UploadApi'
import dayjs from 'dayjs'

export type AddFollowRecordProps = {
  params: {
    visible: boolean
    currentRow: BussinesFollowRecordType
  }
  onOk: (params: BussinesFollowRecordType) => void
  onCancel: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AddFollowRecord: React.FC<AddFollowRecordProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params

  const essential = useSelector((state: RootState) => state.essentail)

  const [form] = Form.useForm()

  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        followedAt: dayjs(currentRow.followedAt),
      })
      setFileList([{ name: currentRow.fileName, uid: currentRow.fileId }])
    } else {
      setFileList([])
    }
  }, [visible])

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx,.pdf,.jpg',
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
            fileId: resp.data.id,
            fileName: resp.data.name,
          })
        })
      }
    },
    fileList,
  }

  const getFollowRecordForm = useCallback(() => {
    const arr = [...AddFollowRecordForm]
    let { customerData = [] } = essential
    arr.map((item) => {
      if (item.name === 'customerId') item.options = customerData
    })
    return arr
  }, [essential])

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue() })
        setTimeout(() => {
          form.resetFields()
          setFileList([])
        }, 500)
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  const close = () => {
    form.resetFields()
    onCancel()
  }

  const getAddFollowRecord = (type: 'add' | 'edit') => {
    useEffect(() => {
      if (type === 'edit') {
      }
      form.resetFields()
    }, [])

    return (
      <>
        <Form form={form} labelCol={{ span: 8 }} layout="vertical">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row gutter={24}>
            {getFollowRecordForm().map((item) => (
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
                  {item.formType === 'textarea' && (
                    <Input.TextArea
                      placeholder={`请输入${item.label}`}
                      autoComplete="off"
                    />
                  )}
                  {item.formType === 'select' && (
                    <Select
                      placeholder={`请选择${item.label}`}
                      filterOption
                      options={item.options}
                      fieldNames={
                        item.selectFileldName ?? {
                          label: 'labal',
                          value: 'value',
                        }
                      }
                    />
                  )}
                  {item.formType === 'date-picker' && (
                    <DatePicker
                      placeholder={`请选择${item.label}`}
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
            <Col span={12}>
              <Form.Item
                name={'fileId'}
                label="上传附件"
                layout="horizontal"
                labelCol={{ span: 4 }}
                colon={false}
              >
                <Upload {...uploadProps}>
                  <Button
                    color="primary"
                    variant="outlined"
                    icon={<UploadOutlined />}
                  >
                    上传文件
                  </Button>
                  <p className="text-sm text-gray-500 mt-[8px]">
                    支持扩展名：doc .docx .pdf .jpg
                  </p>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {!currentRow && (
          <Space className="mb-[30px]">
            <Button onClick={onConfirm} type="primary">
              保存记录
            </Button>
          </Space>
        )}
      </>
    )
  }

  return (
    <>
      {currentRow ? (
        <DragModal
          width="55%"
          open={visible}
          title="编辑跟进记录"
          onOk={onConfirm}
          onCancel={close}
        >
          {getAddFollowRecord('edit')}
        </DragModal>
      ) : (
        getAddFollowRecord('add')
      )}
    </>
  )
}

export default AddFollowRecord
