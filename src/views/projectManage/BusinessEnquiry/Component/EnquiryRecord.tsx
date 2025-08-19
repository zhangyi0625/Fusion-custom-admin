import { memo, useCallback, useEffect, useState } from 'react'
import { Button, Select, Space, Timeline } from 'antd'
import EnquiryIcon from '@/assets/svg/icon/enquiry-icon.svg'
import QuotationIcon from '@/assets/svg/icon/quotation-icon.svg'
import PurchaseIcon from '@/assets/svg/icon/purchase-cion.png'
import LinkIcon from '@/assets/svg/icon/link.svg'
import { getBusinessEnquiryRecord } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import { BussinesEnquiryRecordType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { postDownlFile } from '@/services/upload/UploadApi'
import PreviewFile from '@/components/PreviewFile'

export type EnquiryRecordProps = {
  source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
  projectId: string
}

const EnquiryRecordCom: React.FC<EnquiryRecordProps> = memo(
  ({ source, projectId }) => {
    const [recordType, setRecordType] = useState<boolean | string>('')

    const [enquiryRecord, setEnquiryRecord] = useState([])

    const recordTypeOptions = [
      {
        label: '全部记录',
        value: '',
      },
      {
        label: '报价记录',
        value: false,
      },
      {
        label: '询价记录',
        value: true,
      },
    ]

    const [fileParams, setFileParams] = useState<{
      code: string
      fileId: string
    }>({
      code: '',
      fileId: '',
    })

    const handleContextMenu = useCallback((event: MouseEvent) => {
      event.preventDefault() // 阻止默认的上下文菜单
    }, [])

    const onClosePreviewFile = () => {
      setFileParams({ code: '', fileId: '' })
      document.removeEventListener('contextmenu', handleContextMenu)
    }

    useEffect(() => {
      projectId && loadBusinessEnquiryRecord('')
    }, [source, projectId])

    const preview = (fileId: string, fileName: string) => {
      if (!fileId) return
      setFileParams({
        code: fileName,
        fileId: fileId,
      })
    }

    const download = (fileId: string, fileName: string) => {
      if (!fileId) return
      postDownlFile(fileId).then((resp) => {
        let blobUrl = window.URL.createObjectURL(resp)
        const aElement = document.createElement('a')
        document.body.appendChild(aElement)
        aElement.style.display = 'none'
        aElement.href = blobUrl
        aElement.download = fileName
        aElement.click()
        document.body.removeChild(aElement)
      })
    }

    const loadBusinessEnquiryRecord = (type: boolean | string) => {
      getBusinessEnquiryRecord(projectId, {
        isInquery: type,
      }).then((resp) => {
        let data = resp.map((item: BussinesEnquiryRecordType) => {
          return {
            dot: (
              <div>
                <img
                  src={item.isInquery ? EnquiryIcon : QuotationIcon}
                  className="w-[36px] h-[36px]"
                  alt=""
                />
              </div>
            ),
            children: (
              <>
                <div className="text-gray-400 ml-[16px] text-sm">
                  {item.createTime}
                  <span className="ml-[16px]">{item.createName}</span>
                  <p className="text-dull-grey my-[8px]">{item.content}</p>
                </div>
                <div className="flex items-center justify-between w-[636px] ml-[16px] bg-neutral-100 px-[12px] rounded-[8px] h-[44px] leading-[44px]">
                  <div className="flex items-center">
                    <img src={LinkIcon} className="w-[16px] h-[16px]" alt="" />
                    <p className="ml-[3px] text-dull-grey">{item.fileName}</p>
                  </div>
                  <div>
                    <Space>
                      <Button
                        onClick={() => preview(item.fileId, item.fileName)}
                        type="link"
                      >
                        预览
                      </Button>
                      <Button
                        onClick={() => download(item.fileId, item.fileName)}
                        type="link"
                      >
                        下载
                      </Button>
                    </Space>
                  </div>
                </div>
              </>
            ),
          }
        })
        setEnquiryRecord(data)
      })
    }

    const changeType = (type: boolean | string) => {
      setRecordType(type)
      loadBusinessEnquiryRecord(type)
    }

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
                onChange={(e: boolean | string) => changeType(e)}
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
        <PreviewFile params={fileParams} onCancel={onClosePreviewFile} />
      </>
    )
  }
)

export default EnquiryRecordCom
