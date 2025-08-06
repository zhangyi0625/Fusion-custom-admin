import { memo, useState } from 'react'
import { Button, Space, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import { getBusinessEnquiryListPage } from '@/services/projectManage/BusinessEnquiry/BusinessEnquiryApi'
import SupplierTransfer from '../../SupplierTransfer'

export type SupplierInfoProps = {
  source: 'BusinessEnquiry' | 'SaleProject'
}

const SupplierInfoCom: React.FC<SupplierInfoProps> = memo(({ source }) => {
  const [params, setParams] = useState<{
    visible: boolean
    selected: string[] | null
  }>({
    visible: false,
    selected: null,
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
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button onClick={importEnquiry} type="link">
              上传询价表
            </Button>
            <Button onClick={() => deleteItem(_.id)} type="link" color="red">
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const importEnquiry = () => {}

  const confirmOffer = () => {}

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
    </>
  )
})

export default SupplierInfoCom
