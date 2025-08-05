import { Button, Space, Timeline } from 'antd'
import { memo } from 'react'
import EnquiryIcon from '@/assets/svg/icon/enquiry-icon.svg'
import LinkIcon from '@/assets/svg/icon/link.svg'

export type EnquiryRecordProps = {}

const EnquiryRecordCom: React.FC<EnquiryRecordProps> = memo(() => {
  const preview = () => {}

  const download = () => {}

  const enquiryRecord = [
    {
      dot: <img src={EnquiryIcon} className="w-[36px] h-[36px]" alt="" />,
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
      dot: <img src={EnquiryIcon} className="w-[36px] h-[36px]" alt="" />,
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
      <Timeline items={enquiryRecord} />
    </>
  )
})

export default EnquiryRecordCom
