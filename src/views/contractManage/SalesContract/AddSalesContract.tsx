import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  GetProp,
  Input,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import DragModal from '@/components/modal/DragModal'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import type { SaleContractType } from '@/services/contractManage/SalesContract/SalesContractModel'
import { AddSalesContractForm } from '../config'
import { postUploadFile } from '@/services/upload/UploadApi'
import { CustomColumn } from 'customer-search-form-table/SearchForm/type'
import { getBusinessEnquiryList } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import dayjs from 'dayjs'

export type AddSalesContractProps = {
  params: {
    visible: boolean
    currentRow: SaleContractType | null
    source: string
  }
  onOk: (params: SaleContractType) => void
  onCancel: () => void
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const AddSalesContract: React.FC<AddSalesContractProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, source } = params

  const [form] = Form.useForm()

  const essential = useSelector((state: RootState) => state.essentail)

  const [formMap, setFormMap] = useState(AddSalesContractForm)

  const [fileList, setFileList] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!visible) return
    if (source === 'SaleProject') {
      formMap.map((item) => {
        let filterKeys = [
          'salesProjectId',
          'customerId',
          'companyId',
          'salespersonId',
        ]
        if (filterKeys.includes(item.name)) item.hiddenItem = true
      })
      setFormMap([...formMap])
    } else {
      init()
    }
    !currentRow && form.resetFields()
    currentRow &&
      form.setFieldsValue({
        ...currentRow,
        contractTime: dayjs(currentRow.contractTime),
      })
  }, [visible])

  const init = async () => {
    let { userData, customerData, payerUnitData } = essential
    const res = await getBusinessEnquiryList({ isInquiry: 0 })
    formMap.map((item) => {
      if (
        item.name === 'customerId' ||
        item.name === 'salespersonId' ||
        item.name === 'companyId'
      )
        item.options =
          item.name === 'customerId'
            ? customerData
            : item.name === 'salespersonId'
            ? userData
            : payerUnitData
      if (item.name === 'salesProjectId') item.options = res
    })
    setFormMap([...formMap])
    console.log(formMap, 'formMapssss')
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx',
    beforeUpload(file) {
      setFileList(fileList.concat([file]))
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
            fileIds: [resp.data.id],
          })
        })
      }
    },
    fileList,
  }

  const selectChange = (
    item: Omit<CustomColumn, 'selectFetch' | 'hiddenItem'>
  ) => {
    if (item.name !== 'customerId') return
    else {
      let company = formMap.find((item) => item.name === 'customerId')
        ?.options as any[]
      form.setFieldsValue({
        ...form.getFieldsValue(),
        companyId: company?.find(
          (el) => el.id === form.getFieldValue('customerId')
        )?.companyId,
      })
    }
  }

  const onConfirm = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue(), source: 'S' })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      width="60%"
      open={visible}
      title={currentRow ? '编辑合同' : '新建合同'}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 8 }} layout="vertical">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMap.map((item) => (
            <Col
              span={item.span}
              key={item.name}
              style={{ display: item.hiddenItem ? 'none' : '' }}
            >
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
                {item.formType === 'select' && (
                  <Select
                    onChange={() => selectChange(item)}
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={item.options}
                    allowClear
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'label',
                        value: 'value',
                      }
                    }
                  />
                )}
                {item.formType === 'date-picker' && (
                  <DatePicker
                    style={{ width: '100%' }}
                    format={'YY-MM-DD HH:mm:ss'}
                  />
                )}
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item
              name={'fileIds'}
              label="合同附件"
              layout="horizontal"
              labelCol={{ span: 2 }}
              colon={false}
              rules={[
                {
                  required: true,
                  message: '请上传合同附件',
                },
              ]}
            >
              <Upload {...uploadProps}>
                <Button
                  className="ml-[10px]"
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

export default AddSalesContract
