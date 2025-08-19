import React, { useEffect, useState } from 'react'
import DragModal from '../modal/DragModal'
import { Spin } from 'antd'
import { postPreviewFile } from '@/services/upload/UploadApi'
import './index.css'
import '@js-preview/excel/lib/index.css'
import jsPreviewExcel from '@js-preview/excel'

export type PreviewFileType = {
  params: {
    code: string
    fileId: string
  }
  onCancel: () => void
}

const PreviewFile: React.FC<PreviewFileType> = ({ params, onCancel }) => {
  const { code, fileId } = params

  const [loading, setLoading] = useState(false)

  const [modalVisit, setModalVisit] = useState(false)

  const [fileName, setFileName] = useState('')

  const [blobUrl, setBlobUrl] = useState('')

  useEffect(() => {
    if (code) {
      setModalVisit(true)
      if (getFileType(code)) {
        getCode(code)
      }
    } else {
      onClear()
    }
    return () => {
      onClear()
    }
  }, [code])

  const onClose = () => {
    setModalVisit(false)
    onCancel()
  }

  useEffect(() => {
    if (!modalVisit) onClose

    // getCode(code)
  }, [modalVisit])

  const onClear = () => {
    blobUrl && window.URL.revokeObjectURL(blobUrl)
    setBlobUrl('')
    setFileName('')
    const freviewFileDom = document.getElementById('freviewFile')
    while (freviewFileDom?.firstChild) {
      freviewFileDom.removeChild(freviewFileDom.firstChild)
    }
  }
  const getFileName = (code: string) => {
    const lastSlashIndex = code.lastIndexOf('/')
    const fileName = code.substring(lastSlashIndex + 1)
    return fileName
  }
  const getFileType = (name: string) => {
    if (name) {
      if (name.lastIndexOf('.') > -1) {
        return name.slice(name.lastIndexOf('.') + 1)
      } else {
        return false
      }
    }
  }

  const getCode = (code: string) => {
    setLoading(true)
    const fileName = getFileName(code)
    setFileName(fileName)
    const fileType = getFileType(code)
    if (!fileType) {
      return
    }
    postPreviewFile(fileId)
      .then((resp) => {
        const blob = new Blob([resp])
        let reader = new FileReader()
        if (fileType === 'xls' || fileType === 'xlsx') {
          reader.readAsArrayBuffer(blob)
          reader.onload = async (e: any) => {
            const box = document.createElement('div')
            box.style.width = '94%'
            box.style.minHeight = '700px'
            // box.style.maxHeight = '500px'
            box.style.marginLeft = '3%'
            const myExcelPreviewer = jsPreviewExcel.init(box)
            myExcelPreviewer
              .preview(e.target.result)
              .then(() => {
                console.info('预览完成')
                setLoading(false)
              })
              .catch((e) => {
                console.info('预览失败', e)
                setLoading(false)
              })
            const freviewFileDom = document.getElementById('freviewFile')
            while (freviewFileDom?.firstChild) {
              freviewFileDom.removeChild(freviewFileDom.firstChild)
            }
            freviewFileDom?.appendChild(box)
          }
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        const box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = '300px'
        box.style.textAlign = 'center'
        box.style.fontSize = '18px'
        box.style.lineHeight = '300px'
        box.innerHTML = '解析文件失败了，可下载文件查看'
        const freviewFileDom = document.getElementById('freviewFile')
        while (freviewFileDom?.firstChild) {
          freviewFileDom.removeChild(freviewFileDom.firstChild)
        }
        freviewFileDom?.appendChild(box)
      })
  }

  return (
    <DragModal
      width="70%"
      open={modalVisit}
      title={fileName}
      onCancel={onClose}
      afterOpenChange={setModalVisit}
      footer={null}
    >
      <Spin spinning={loading} delay={500} tip="加载中">
        <div
          id="freviewFile"
          className="freviewFile"
          style={{ minHeight: 500 }}
        ></div>
      </Spin>
    </DragModal>
  )
}

export default PreviewFile
