import { Button, Select, Space, Timeline } from 'antd'
import { memo, useEffect, useState } from 'react'
import EnquiryIcon from '@/assets/svg/icon/enquiry-icon.svg'
import QuotationIcon from '@/assets/svg/icon/quotation-icon.svg'
import PurchaseIcon from '@/assets/svg/icon/purchase-cion.png'
import LinkIcon from '@/assets/svg/icon/link.svg'
import { getBusinessEnquiryRecord } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'

export type EnquiryRecordProps = {
  source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
  projectId: string
}

const EnquiryRecordCom: React.FC<EnquiryRecordProps> = memo(
  ({ source, projectId }) => {
    const preview = () => {}

    const download = () => {}

    const [recordType, setRecordType] = useState<string>('')
    const recordTypeOptions = [
      {
        label: '全部记录',
        value: '',
      },
      {
        label: '询价记录',
        value: 1,
      },
      {
        label: '报价记录',
        value: 2,
      },
    ]

    useEffect(() => {
      projectId && loadBusinessEnquiryRecord()
    }, [source, projectId])

    const loadBusinessEnquiryRecord = () => {
      console.log('getBusinessEnquiryRecord', projectId)
      getBusinessEnquiryRecord(projectId).then((resp) => {})
    }

    const enquiryRecord = [
      {
        dot: (
          <div>
            <img src={EnquiryIcon} className="w-[36px] h-[36px]" alt="" />
          </div>
        ),
        children: (
          <div className="text-gray-400 ml-[16px] text-sm">
            2015-08-22 12:00:00<span className="ml-[16px]">赛锦悦</span>
            <p className="text-dull-grey my-[8px]">
              上传供应商“真和物流科技”询价表
            </p>
            <div className="flex items-center justify-between w-[636px] bg-neutral-100 px-[12px] rounded-[8px] h-[44px] leading-[44px]">
              <div className="flex items-center">
                <img src={LinkIcon} className="w-[16px] h-[16px]" alt="" />
                <p className="ml-[3px] text-dull-grey">这是附件的名称.doc</p>
              </div>
              <div>
                <Space>
                  <Button onClick={preview} type="link">
                    预览
                  </Button>
                  <Button onClick={download} type="link">
                    下载
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        ),
      },
      {
        dot: <img src={QuotationIcon} className="w-[36px] h-[36px]" alt="" />,
        children: (
          <div className="text-gray-400 ml-[16px] text-sm">
            2015-08-22 12:00:00<span className="ml-[16px]">赛锦悦</span>
            <p className="text-dull-grey">上传供应商“真和物流科技”询价表</p>
          </div>
        ),
      },
      {
        dot: <img src={PurchaseIcon} className="w-[36px] h-[36px]" alt="" />,
        children: (
          <div className="text-gray-400 ml-[16px] text-sm">
            2015-08-22 12:00:00<span className="ml-[16px]">赛锦悦</span>
            <p className="text-dull-grey">上传供应商“真和物流科技”询价表</p>
          </div>
        ),
      },
    ]

    return (
      <>
        <div className="flex flex-col enquiry-record">
          <div className="mb-[20px]">
            {source === 'SaleProject' && (
              <Select
                style={{ width: '272px' }}
                allowClear
                placeholder="请选择"
                showSearch
                value={recordType}
                onChange={(e: string) => setRecordType(e)}
                options={recordTypeOptions}
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            )}
          </div>
          <Timeline items={enquiryRecord} />
        </div>
      </>
    )
  }
)

export default EnquiryRecordCom
