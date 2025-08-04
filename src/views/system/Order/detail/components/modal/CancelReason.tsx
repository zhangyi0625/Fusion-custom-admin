import { memo, useEffect, useState } from 'react'
import DragModal from '@/components/modal/DragModal'
import { Form, Select, Input } from 'antd'
import { BookingFailReason } from './config'

interface CancelReasonProps {
  visible: boolean
  onCancel: () => void
  onOk: (cancelReason: string) => void
}

const CancelReason: React.FC<CancelReasonProps> = memo(
  ({ visible, onCancel, onOk }) => {
    const [form] = Form.useForm()

    const { TextArea } = Input

    useEffect(() => {
      if (!visible) return
    }, [visible])

    const handleOk = () => {
      onOk(cancelReason ? cancelReason : form.getFieldValue('cancelType'))
    }

    const [cancelReason, setCancelReson] = useState<string>('')

    const addText = (text: string) => {
      let cancelReason = form.getFieldValue('cancelReason')
      if (!cancelReason) cancelReason = text
      if (cancelReason.indexOf(text) === -1) cancelReason += ',' + text
      form.setFieldsValue({
        cancelReason: cancelReason,
      })
      setCancelReson(cancelReason)
    }
    const handleCancel = () => {
      form.resetFields()
      setCancelReson('')
      onCancel()
    }
    return (
      <DragModal
        title="补充资料"
        width={'580px'}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ cancelType: '已取消' }}>
          <Form.Item label={'取消订舱类型'} name={'cancelType'}>
            <Select
              allowClear
              placeholder="请选择取消订舱类型"
              showSearch
              defaultActiveFirstOption={false}
              filterOption={false}
              options={['已取消', '订舱失败'].map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>
          <Form.Item label={'订舱失败原因'} name={'cancelReason'}>
            <div className="text-xs">
              <TextArea
                value={cancelReason}
                placeholder="点击选择订舱失败原因"
              />
              {BookingFailReason.map((item) => (
                <div className="my-[5px]" key={item.label}>
                  {item.label}：
                  {item.reason.map((text) => (
                    <span
                      className="mr-[5px] text-dull-blue underline cursor-pointer"
                      onClick={() => addText(text)}
                      key={text}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </DragModal>
    )
  }
)

export default CancelReason
