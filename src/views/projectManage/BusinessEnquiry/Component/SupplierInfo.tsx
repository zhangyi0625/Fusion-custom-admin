import { memo, useEffect, useState } from 'react'
import { App, Button, Space, Table, TableProps } from 'antd'
import { CheckCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { SearchTable } from 'customer-search-form-table'
import {
  addBatchBusinessSupplier,
  confirmBussinesSupplier,
  getBusinessSupplier,
} from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import SupplierTransfer from '../../SupplierTransfer'
import ImportEnquiry from '../../ImportEnquiry'
import MakeQuotationModal from '../../MakeQuotationModal'
import EditQuotation from '../../EditQuotation'
import ConfirmQuotation from '../../ConfirmQuotation'
import { deleteSaleProjectList } from '@/services/projectManage/SaleProject/SaleProjectApi'
import type { BusinessEnquiryType } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryModel'

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

    useEffect(() => {
      projectId && loadSupplierInfo()
    }, [])

    const [enquiryModal, setEnquiryModal] = useState<{
      visible: boolean
      isFirst: boolean
    }>({
      visible: false,
      isFirst: true,
    })

    const [quotationModal, setQuotationModal] = useState<{
      visible: boolean
    }>({
      visible: false,
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
            >
              {value.inquiryFile ?? '未上传'}
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
                value.inquiryFile
                  ? 'text-blue-500 cursor-pointer'
                  : 'text-dull-grey'
              }
            >
              {value.quotationFile ?? '未生成'}
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
                  })
                }
                type="link"
              >
                上传询价表
              </Button>
              {source === 'SaleProject' && !_.quotationFile && (
                <Button
                  onClick={() => setQuotationModal({ visible: true })}
                  type="link"
                >
                  制作报价
                </Button>
              )}
              {source === 'SaleProject' && _.quotationFile && (
                <Button
                  onClick={() => {
                    setEditModal({
                      editQuotation: true,
                      confirmQuotation: false,
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

    const loadSupplierInfo = async () => {
      const res = await getBusinessSupplier(projectId)
      setDataSource(res)
    }

    const importSuccess = (params: { supplierId: string }) => {
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
          deleteSaleProjectList(id).then(() => {
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

    const confirmEditQuotation = () => {}

    return (
      <>
        <div className="w-full flex items-center justify-end mb-[8px]">
          <Space>
            {source === 'SaleProject' && (
              <Button
                onClick={() =>
                  setEditModal({ editQuotation: false, confirmQuotation: true })
                }
                type="default"
              >
                确认报价
              </Button>
            )}
            {source === 'SaleProject' && (
              <div className="flex items-center text-green-500">
                <CheckCircleOutlined twoToneColor="#52C41A" />
                <p className="ml-[12px]">已确认该XXXXXXX的报价</p>
              </div>
            )}
            <Button
              onClick={() => setParams({ visible: true, selected: null })}
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
          onCancel={() => setEnquiryModal({ visible: false, isFirst: true })}
          onOk={confirmEditQuotation}
        />
        <MakeQuotationModal
          params={quotationModal}
          onCancel={() => setQuotationModal({ visible: false })}
          onOk={confirmEditQuotation}
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
          onOk={importSuccess}
        />
      </>
    )
  }
)

export default SupplierInfoCom
