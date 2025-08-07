import { memo, useState } from 'react'
import { Button, Space, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import SupplierTransfer from '../../SupplierTransfer'
import ImportEnquiry from '../../ImportEnquiry'
import MakeQuotationModal from '../../MakeQuotationModal'

export type SupplierInfoProps = {
  source: 'BusinessEnquiry' | 'PurchaseBargain' | 'SaleProject'
}

const SupplierInfoCom: React.FC<SupplierInfoProps> = memo(({ source }) => {
  const [params, setParams] = useState<{
    visible: boolean
    selected: string[] | null
  }>({
    visible: false,
    selected: null,
  })

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

  const tableColumns: TableProps['columns'] = [
    {
      title: '供应商',
      key: 'projectType',
      dataIndex: 'projectType',
      align: 'center',
    },
    {
      title: '最新询价表',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '询价修改时间',
      key: 'payType',
      dataIndex: 'payType',
      align: 'center',
    },
    {
      title: '最新报价表',
      key: 'payType1',
      align: 'center',
      hidden: source !== 'SaleProject',
    },
    {
      title: '报价生成时间',
      key: 'payType2',
      align: 'center',
      hidden: source !== 'SaleProject',
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
              onClick={() => setEnquiryModal({ visible: true, isFirst: false })}
              type="link"
            >
              上传询价表
            </Button>
            {source === 'SaleProject' && (
              <Button
                onClick={() => setQuotationModal({ visible: true })}
                type="link"
              >
                制作报价
              </Button>
            )}
            <Button onClick={() => deleteItem(_.id)} type="link" color="red">
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const confirmOffer = () => {}

  const importSuccess = () => {}

  const deleteItem = (id: string) => {}

  return (
    <>
      <div className="w-full flex items-center justify-end mb-[8px]">
        <Space>
          {source === 'SaleProject' && (
            <Button onClick={confirmOffer} type="default">
              确认报价
            </Button>
          )}
          <Button
            onClick={() => setParams({ visible: true, selected: null })}
            type="primary"
          >
            新增供应商
          </Button>
        </Space>
      </div>
      <SearchTable
        size="middle"
        columns={tableColumns}
        bordered
        rowKey="id"
        totalKey="total"
        fetchResultKey="data"
        fetchData={getBusinessEnquiryListPage}
        isSelection={false}
        isPagination={false}
        onUpdatePagination={() => {
          return
        }}
      />
      <SupplierTransfer
        params={params}
        onCancel={() => setParams({ visible: false, selected: null })}
        onOk={(newArr: string[]) =>
          setParams({ visible: false, selected: newArr })
        }
      />
      <ImportEnquiry
        params={enquiryModal}
        onCancel={() => setEnquiryModal({ visible: false, isFirst: true })}
        onOk={importSuccess}
      />
      <MakeQuotationModal
        params={quotationModal}
        onCancel={() => setQuotationModal({ visible: false })}
        onOk={importSuccess}
      />
    </>
  )
})

export default SupplierInfoCom
