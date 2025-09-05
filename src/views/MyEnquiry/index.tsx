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
  const [drawer, setDrawer] = useState<{ visible: boolean; currentRow: null }>({
    visible: false,
    currentRow: null,
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
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '客户',
      key: 'customerName',
      dataIndex: 'customerName',
      align: 'center',
      width: 100,
    },
    {
      title: '手机号',
      key: 'customerPhone',
      dataIndex: 'customerPhone',
      align: 'center',
      width: 120,
    },
    {
      title: '报价数',
      key: 'viewCount',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.viewCount}</div>
      },
    },
    {
      title: '浏览量',
      key: 'quotationCount',
      dataIndex: 'quotationCount',
      align: 'center',
      width: 100,
    },
    {
      title: '报价金额',
      key: 'amount',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.amount}</div>
      },
    },
    {
      title: '城市/区县',
      key: 'address',
      dataIndex: 'address',
      align: 'center',
      width: 150,
    },
    {
      title: '报价截止日期',
      key: 'deadline',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.deadline, 'Y-M-D')}</div>
      },
    },
    {
      title: '询价创建日期',
      key: 'createTime',
      dataIndex: 'createTime',
      align: 'center',
      width: 200,
    },
    {
      title: '简要说明',
      key: 'remark',
      dataIndex: 'remark',
      align: 'center',
      width: 120,
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
              onClick={() => setDrawer({ visible: true, currentRow: _ })}
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
              onChange={(e: any) => onChange(e)}
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
          onCancel={() => setDrawer({ visible: false, currentRow: null })}
        />
      </div>
    </>
  )
}

export default MyEnquiry
