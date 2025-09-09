import styles from '../EnquiryHall/enquiryHall.module.scss'
import { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxProps,
  Input,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import { formatTime } from '@/utils/format'
import { SearchTable } from 'customer-search-form-table'
import { getMyEnquiryByPage } from '@/services/myEnquiry/myEnquiryApi'
import { MyEnquiryParams } from '@/services/myEnquiry/myEnquiryModel'
import MyEnquiryDetail from './MyEnquiryDetail'

const MyEnquiry: React.FC = () => {
  const [drawer, setDrawer] = useState<{
    visible: boolean
    currentRow: null
    type: string
  }>({
    visible: false,
    currentRow: null,
    type: '',
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState<MyEnquiryParams>({
    title: null,
    alternative: false,
    page: 1,
    limit: 10,
    sort: 'create_time desc',
  })

  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    setInputValue('')
  }, [])

  const tableColumns: TableProps['columns'] = [
    {
      title: '询价标题',
      key: 'title',
      align: 'left',
      width: 200,
      render(value) {
        return (
          <div
            className="cursor-pointer text-blue-500"
            onClick={() =>
              setDrawer({
                visible: true,
                currentRow: value,
                type: 'CustomerEnquiryDetail',
              })
            }
          >
            {value.title}
          </div>
        )
      },
    },
    {
      title: '报价总金额',
      key: 'amount',
      align: 'left',
      width: 150,
      render(value) {
        return <div>{value.amount}</div>
      },
    },
    {
      title: '报价时间',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'left',
      width: 200,
    },
    {
      title: '是否为备选供应商',
      key: 'alternative',
      align: 'left',
      width: 150,
      render(value) {
        return <div>{value.alternative ? '是' : '否'}</div>
      },
    },
    {
      title: '预估金额(万元)',
      key: 'estimatedAmount',
      dataIndex: 'estimatedAmount',
      align: 'left',
      width: 120,
    },
    {
      title: '截止报价日期',
      key: 'deadline',
      align: 'left',
      width: 180,
      render(value) {
        return <div>{formatTime(value.deadline, 'Y-M-D')}</div>
      },
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
                setDrawer({
                  visible: true,
                  currentRow: _,
                  type: 'MyQuotationDetail',
                })
              }
              type="link"
            >
              报价明细
            </Button>
          </Space>
        )
      },
    },
  ]

  const onSearch = () => {
    setSearchDefaultForm({ ...searchDefaultForm, title: inputValue })
  }

  const onChange: CheckboxProps['onChange'] = (value: any) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      alternative: value.target.checked,
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }

  return (
    <>
      <div className={styles['enquiry-hall']}>
        <div className={styles['enquiry-hall-bg']}></div>
        <div className={styles['enquiry-hall-content']}>
          <div
            className={styles['enquiry-hall-filter']}
            style={{ height: '72px' }}
          >
            <Input
              placeholder="请输入询价标题"
              allowClear
              style={{ width: '272px' }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            ></Input>
            <Button
              type="primary"
              style={{ margin: '0 40px 0 10px' }}
              onClick={onSearch}
            >
              查询
            </Button>
            <Checkbox
              onChange={(e) => onChange(e)}
              checked={searchDefaultForm.alternative}
            >
              仅查看成为备选供应商的报价
            </Checkbox>
          </div>
          <div className="mt-[10px] bg-white rounded-[6px] px-[24px] py-[20px]">
            <SearchTable
              size="middle"
              columns={tableColumns}
              bordered
              rowKey="id"
              totalKey="count"
              fetchResultKey="list"
              scroll={{ x: 'max-content', y: 568 }}
              fetchData={getMyEnquiryByPage}
              searchFilter={searchDefaultForm}
              isSelection={false}
              isPagination={true}
              onUpdatePagination={onUpdatePagination}
            />
          </div>
        </div>
        <MyEnquiryDetail
          params={drawer}
          onCancel={() =>
            setDrawer({ visible: false, currentRow: null, type: '' })
          }
        />
      </div>
    </>
  )
}

export default MyEnquiry
