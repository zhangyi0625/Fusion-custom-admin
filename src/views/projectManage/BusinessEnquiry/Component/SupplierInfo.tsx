import { memo, useEffect, useState } from 'react'
import { App, Button, Space, Table, TableProps } from 'antd'
import { CheckCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { SearchTable } from 'customer-search-form-table'
import {
  addBatchBusinessSupplier,
  confirmBussinesSupplier,
  deleteBusinessSupplier,
  downloadBusinessEnquiry,
  getBusinessSupplier,
  importBusinessEnquiry,
  putBusinessSupplierProduct,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import SupplierTransfer from '../../SupplierTransfer'
import ImportEnquiry from '../../ImportEnquiry'
import MakeQuotationModal from '../../MakeQuotationModal'
import EditQuotation from '../../EditQuotation'
import ConfirmQuotation from '../../ConfirmQuotation'
import type {
  BusinessEnquiryType,
  BussinesEnquiryImportType,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'
import { getSupplierDetail } from '@/services/supplierManage/Supplier/SupplierApi'
import { postDownlFile } from '@/services/upload/UploadApi'
import { MakeQuotationTableType } from '@/services/projectManage/SaleProject/SaleProjectModel'

export type SupplierInfoProps = {
  source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
  projectId: string
  detail: BusinessEnquiryType
  onFreshDetail: () => void
}

const SupplierInfoCom: React.FC<SupplierInfoProps> = memo(
  ({ source, projectId, detail, onFreshDetail }) => {
    const { modal, message } = App.useApp()

    const [dataSource, setDataSource] = useState([])

    const [params, setParams] = useState<{
      visible: boolean
      selected: string[] | null
    }>({
      visible: false,
      selected: null,
    })

    const [supplierName, setSupplierName] = useState<string | null>(null)

    const [editProducts, setEditProducts] = useState<MakeQuotationTableType[]>(
      []
    )

    useEffect(() => {
      setSupplierName(null)
      projectId && loadSupplierInfo()
      detail.confirmSupplierId && loadSupplierDetail()
      setEditProducts([])
    }, [projectId, detail.confirmSupplierId])

    const [enquiryModal, setEnquiryModal] = useState<{
      visible: boolean
      isFirst: boolean
      id: string | null
    }>({
      visible: false,
      isFirst: true,
      id: null,
    })

    const [quotationModal, setQuotationModal] = useState<{
      visible: boolean
      supplierId: string | null
      edit: boolean
    }>({
      visible: false,
      supplierId: null,
      edit: false,
    })

    const [editModal, setEditModal] = useState<{
      editQuotation: boolean
      confirmQuotation: boolean
    }>({
      editQuotation: false,
      confirmQuotation: false,
    })

    const tableColumns: TableProps['columns'] = [
      {
        title: '供应商',
        key: 'supplierName',
        dataIndex: 'supplierName',
        align: 'center',
        width: 120,
      },
      {
        title: '最新询价表',
        key: 'inquiryFile',
        align: 'center',
        width: 200,
        render(value) {
          return (
            <div
              className={
                value.inquiryFile
                  ? 'text-blue-500 cursor-pointer'
                  : 'text-dull-grey'
              }
              onClick={() =>
                downLoadFile(value.inquiryFile, value.inquiryFileName)
              }
            >
              {value.inquiryFileName ?? '未上传'}
            </div>
          )
        },
      },
      {
        title: '询价修改时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
        align: 'center',
        width: 200,
      },
      {
        title: '最新报价表',
        key: 'quotationFile',
        align: 'center',
        hidden: source !== 'SaleProject',
        width: 150,
        render(value) {
          return (
            <div
              className={
                value.quotationFile
                  ? 'text-blue-500 cursor-pointer'
                  : 'text-dull-grey'
              }
              onClick={() =>
                downLoadFile(value.quotationFile, value.quotationFileName)
              }
            >
              {value.quotationFileName ?? '未生成'}
            </div>
          )
        },
      },
      {
        title: '报价生成时间',
        key: 'quotationTime',
        align: 'center',
        hidden: source !== 'SaleProject',
        render(value) {
          return <div>{value.quotationTime ?? '-'}</div>
        },
        width: 200,
      },
      {
        title: '操作',
        width: '10%',
        fixed: 'right',
        align: 'center',
        render(_) {
          return (
            <Space>
              <Button
                onClick={() =>
                  setEnquiryModal({
                    visible: true,
                    isFirst: !_.inquiryFile,
                    id: _.id,
                  })
                }
                type="link"
              >
                上传询价表
              </Button>
              {source === 'SaleProject' && !_.quotationFile && (
                <Button
                  onClick={() =>
                    setQuotationModal({
                      visible: true,
                      supplierId: _.id,
                      edit: false,
                    })
                  }
                  type="link"
                >
                  制作报价
                </Button>
              )}
              {source === 'SaleProject' && _.quotationFile && (
                <Button
                  onClick={() => {
                    setQuotationModal({
                      visible: true,
                      supplierId: _.id,
                      edit: true,
                    })
                  }}
                  type="link"
                >
                  修改报价
                </Button>
              )}
              <Button
                onClick={() => deleteItem(_.id)}
                color="danger"
                variant="link"
              >
                删除
              </Button>
            </Space>
          )
        },
      },
    ]

    const downLoadFile = (fileId: string, fileName: string) => {
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

    const loadSupplierInfo = async () => {
      const res = await getBusinessSupplier(projectId)
      setDataSource(res)
    }

    const ConfirmQuotationBySupplier = (params: { supplierId: string }) => {
      confirmBussinesSupplier({
        projectId: projectId,
        supplierId: params.supplierId,
      }).then(() => {
        onFreshDetail()
        setEditModal({ ...editModal, confirmQuotation: false })
      })
    }

    const deleteItem = (id: string) => {
      modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleFilled />,
        content:
          '供应商下的询价表和报价表，将随供应商一并删除。是否确定删除此供应商？！',
        onOk() {
          deleteBusinessSupplier(id).then(() => {
            message.success('删除成功')
            loadSupplierInfo()
          })
        },
      })
    }

    const updateSupplier = async (currentRow: string[]) => {
      try {
        let params = {
          projectId: projectId,
          supplierIds: currentRow,
        }
        await addBatchBusinessSupplier(params)
        message.success('添加成功')
        // 操作成功，关闭弹窗，刷新数据
        setParams({ visible: false, selected: null })
        loadSupplierInfo()
      } catch (error) {}
    }

    const confirmEditQuotation = (params: { modifyReason: string }) => {
      downloadBusinessEnquiry({
        id: quotationModal.supplierId as string,
        products: editProducts,
        modifyReason: params.modifyReason,
      }).then(() => {
        message.success('修改报价成功')
        setEditModal({ ...editModal, editQuotation: false })
        loadSupplierInfo()
      })
    }

    const confirmImportEnquiry = (current: BussinesEnquiryImportType) => {
      importBusinessEnquiry({ ...current }).then(() => {
        message.success('上传成功')
        setEnquiryModal({ visible: false, isFirst: true, id: null })
        loadSupplierInfo()
      })
    }

    const confirmQuotationModal = (products: {
      data: MakeQuotationTableType[]
      type: string
    }) => {
      if (products.type === 'submit') {
        putBusinessSupplierProduct(products.data).then(() => {
          message.success('修改成功')
          setQuotationModal({ visible: false, supplierId: null, edit: false })
          loadSupplierInfo()
        })
      } else {
        setEditProducts(products.data)
        if (quotationModal.edit) {
          setEditModal({
            editQuotation: true,
            confirmQuotation: false,
          })
        } else {
          downloadBusinessEnquiry({
            id: quotationModal.supplierId as string,
            products: products.data,
          }).then((resp) => {
            console.log(resp, 'resp')
          })
        }
      }
    }

    const loadSupplierDetail = async () => {
      const res = await getSupplierDetail(detail.confirmSupplierId as string)
      setSupplierName(res.name ?? '')
    }

    return (
      <>
        <div className="w-full flex items-center justify-end mb-[8px]">
          <Space>
            {source === 'SaleProject' && !detail.confirmSupplierId && (
              <Button
                onClick={() =>
                  setEditModal({ editQuotation: false, confirmQuotation: true })
                }
                type="default"
              >
                确认报价
              </Button>
            )}
            {source === 'SaleProject' && detail.confirmSupplierId && (
              <div className="flex items-center text-green-500">
                <CheckCircleOutlined twoToneColor="#52C41A" />
                <p className="ml-[12px]">
                  已确认该
                  {supplierName}
                  的报价
                </p>
              </div>
            )}
            <Button
              onClick={() =>
                setParams({
                  visible: true,
                  selected: dataSource.map(
                    (item: { supplierId: string }) => item.supplierId
                  ),
                })
              }
              type="primary"
            >
              新增供应商
            </Button>
          </Space>
        </div>
        {projectId && (
          <Table
            size="middle"
            columns={tableColumns}
            bordered
            rowKey="id"
            dataSource={dataSource}
            scroll={{ x: 'max-content', y: 208 }}
          />
        )}
        <SupplierTransfer
          params={params}
          onCancel={() => setParams({ visible: false, selected: null })}
          projectId={projectId}
          onOk={updateSupplier}
        />
        <ImportEnquiry
          params={enquiryModal}
          onCancel={() =>
            setEnquiryModal({ visible: false, isFirst: true, id: null })
          }
          onOk={confirmImportEnquiry}
        />
        <MakeQuotationModal
          params={quotationModal}
          onCancel={() =>
            setQuotationModal({ visible: false, supplierId: null, edit: false })
          }
          onOk={confirmQuotationModal}
        />
        <EditQuotation
          visible={editModal.editQuotation}
          onCancel={() => setEditModal({ ...editModal, editQuotation: false })}
          onOk={confirmEditQuotation}
        />
        <ConfirmQuotation
          visible={editModal.confirmQuotation}
          onCancel={() =>
            setEditModal({ ...editModal, confirmQuotation: false })
          }
          onOk={ConfirmQuotationBySupplier}
        />
      </>
    )
  }
)

export default SupplierInfoCom
