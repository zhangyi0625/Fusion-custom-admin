import styles from '../EnquiryHall/enquiryHall.module.scss'
import { useState } from 'react'
import {
  Button,
  Checkbox,
  CheckboxProps,
  Input,
  Radio,
  Space,
  TableProps,
} from 'antd'
import { formatTime } from '@/utils/format'

const MyEnquiry: React.FC = () => {
  const [drawer, setDrawer] = useState<{ visible: boolean; currentRow: null }>({
    visible: false,
    currentRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState({
    title: null,
    checked: false,
  })

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
      key: 'phone',
      dataIndex: 'phone',
      align: 'center',
      width: 120,
    },
    {
      title: '报价数',
      key: 'supplierCount',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.supplierCount}</div>
      },
    },
    {
      title: '浏览量',
      key: 'count',
      dataIndex: 'count',
      align: 'center',
      width: 100,
    },
    {
      title: '报价金额',
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.price}万元</div>
      },
    },
    {
      title: '城市/区县',
      key: 'price',
      align: 'center',
      width: 150,
      render(value) {
        return <div>{value.price}万元</div>
      },
    },
    {
      title: '报价截止日期',
      key: 'estimatedPurchaseTime',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{formatTime(value.estimatedPurchaseTime, 'Y-M-D')}</div>
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
      key: 'createName',
      dataIndex: 'createName',
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

  const onSearch = () => {}

  const onChange: CheckboxProps['onChange'] = (value: any) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      checked: value.target.checked,
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
              checked={searchDefaultForm.checked}
            >
              仅查看成为备选供应商的报价
            </Checkbox>
          </div>
          <div className="mt-[10px] bg-white rounded-[6px] px-[24px] py-[20px]"></div>
        </div>
      </div>
    </>
  )
}

export default MyEnquiry
