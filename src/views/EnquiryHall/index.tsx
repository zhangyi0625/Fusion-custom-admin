import styles from './enquiryHall.module.scss'
import { useEffect, useState } from 'react'
import { FilterOptions } from './config'
import { DownOutlined } from '@ant-design/icons'
import {
  Button,
  Cascader,
  CascaderProps,
  message,
  Pagination,
  Table,
  TableProps,
} from 'antd'
import type {
  EnquiryHallItemParams,
  EnquiryHallItemType,
} from '@/services/enquiryHall/enquiryHallModel'
import EnquiryHallDrawer from './EnquiryHallDrawer'
import {
  addSupplierQuotation,
  getEnquiryCity,
  getEnquiryManageByPage,
  getEnquiryManageDetail,
} from '@/services/enquiryHall/enquiryHallApi'
import { formatTime } from '@/utils/format'
import { ProductManageType } from '@/services/productManage/productManageModel'

interface Option {
  value: string
  label: string
  name?: string
  id?: string
  children?: Option[]
}

interface ReEnquiryHallItemType extends EnquiryHallItemType {
  checked: boolean
}

const EnquiryHall: React.FC = () => {
  const [searchDefaultForm, setSearchDefaultForm] =
    useState<EnquiryHallItemParams>({
      sort: '',
      page: 1,
      limit: 10,
      address: '',
    })

  const [enquiryHallList, setEnquiryHallList] = useState<
    ReEnquiryHallItemType[]
  >([])

  const [cityOptions, setCityOptions] = useState()

  const [total, setTotal] = useState<number>(0)

  const [scrollTop, setScrollTop] = useState<number>(0)

  const [isScoll, setIsScoll] = useState<boolean>(false)

  const [params, setParams] = useState<{
    visible: boolean
    detailId: string | null
  }>({
    visible: false,
    detailId: null,
  })

  useEffect(() => {
    loadArea()
  }, [])

  useEffect(() => {
    init()
    window.addEventListener('scroll', handleScroll, true)
  }, [searchDefaultForm])

  //监听header距顶部距离
  const handleScroll = (event: any) => {
    setScrollTop(event.target.scrollTop)
  }

  const loadArea = async () => {
    const resp = await getEnquiryCity()
    setCityOptions(resp)
  }

  const tableColumns: TableProps['columns'] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '产品名称',
      key: 'productName',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '单位',
      key: 'productUnit',
      dataIndex: 'productUnit',
      align: 'center',
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      align: 'center',
    },
  ]

  const init = () => {
    console.log('初始化加载数据....')
    getEnquiryManageByPage(searchDefaultForm).then((res) => {
      res.list.map((item: ReEnquiryHallItemType) => {
        item.checked = false
      })
      setEnquiryHallList(res.list)
      setTotal(res.count)
    })
  }

  const onChange: CascaderProps<Option>['onChange'] = (value) => {
    let address = value ? value[0] + value[1] + value[2] : ''
    setSearchDefaultForm({
      ...searchDefaultForm,
      address: address,
    })
  }

  const loadEnquiryDetail = async (items: ReEnquiryHallItemType) => {
    const res = await getEnquiryManageDetail(items.id as string)
    let newArr = enquiryHallList.map((item) => {
      if (item.id === items.id) {
        item.checked = !items.checked
        item.quotations = !items.checked ? [] : res.products
      }
      return {
        ...item,
      }
    })
    setEnquiryHallList(newArr)
  }

  const onConfirm = (
    currentRow: Omit<
      ProductManageType,
      'status' | 'remark' | 'pinyin' | 'sort'
    >[]
  ) => {
    addSupplierQuotation({
      inquiryId: params.detailId as string,
      items: currentRow,
    }).then(() => {
      message.success('报价成功')
      setParams({ visible: false, detailId: null })
      setSearchDefaultForm({ ...searchDefaultForm })
    })
  }
  return (
    <>
      <div className={styles['enquiry-hall']}>
        <div className={styles['enquiry-hall-bg']}></div>
        <div className={styles['enquiry-hall-content']}>
          <div
            className={
              scrollTop >= 70
                ? styles['enquiry-hall-filter-is-sticky']
                : styles['enquiry-hall-filter']
            }
          >
            {FilterOptions.map((item) => (
              <div
                className={`px-[16px] py-[6px] bg-gray-100 rounded-[4px] mr-[8px] text-${
                  searchDefaultForm.sort === item.value ? 'blue' : 'gray'
                }-500`}
                key={item.title}
                onClick={() =>
                  setSearchDefaultForm({
                    ...searchDefaultForm,
                    sort: item.value as string,
                  })
                }
              >
                {item.title}
              </div>
            ))}
            {/* <div
              style={{
                overflow: 'scroll',
                height: '200px',
                paddingTop: '84px',
              }}
            >
              <div style={{ height: '1000px' }} id="getPopupContainerDiv"> */}
            <Cascader
              placeholder="区域"
              // style={{ background: '#F5F5F5' }}
              fieldNames={{
                label: 'name',
                value: 'name',
                children: 'children',
              }}
              options={cityOptions}
              // onOpenChange={onOpenChange}
              onChange={onChange}
              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
            />
            {/* </div>
            </div> */}
          </div>
          {enquiryHallList.map((item, index) => (
            <div className={styles['enquiry-hall-item']} key={index}>
              <div className="flex items-center">
                <p className="font-semibold text-lg min-w-[120px]">
                  {item.title}
                </p>
                <p className="ml-[20px] text-gray-400">2025-08-22发布</p>
              </div>
              <div className="flex items-center mt-[11px] justify-between">
                <div className="flex items-center text-stone-900">
                  <p>城市/区县：{item.address}</p>
                  <p className="ml-[20px]">
                    截止报价日期：{formatTime(item.deadline, 'Y-M-D')}
                  </p>
                </div>
                <div className="flex items-center justify-between min-w-[350px]">
                  <p className="text-gray-400 mr-[110px]">
                    预估金额
                    <span className="text-red-500 ml-[4px] font-semibold">
                      {item.estimatedAmount}
                    </span>
                  </p>
                  {!item.confirmQuotationId ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() =>
                        setParams({
                          visible: true,
                          detailId: item.id as string,
                        })
                      }
                      style={{ padding: '0 22px' }}
                    >
                      我要报价
                    </Button>
                  ) : (
                    <div className="text-gray-400">已提交报价</div>
                  )}
                </div>
              </div>
              <div className="text-blue-500 mt-[12px] cursor-pointer">
                <a onClick={() => loadEnquiryDetail(item)}>
                  询价清单
                  <DownOutlined
                    style={{
                      width: '10px',
                      height: '10px',
                      marginLeft: '4px',
                    }}
                    rotate={!item.checked ? 180 : 0}
                  />
                </a>
                {item.quotations && item.checked && (
                  <Table
                    style={{ width: '800px', marginTop: '20px' }}
                    rowKey={'id'}
                    size="small"
                    columns={tableColumns}
                    dataSource={item.quotations ?? []}
                    pagination={false}
                  />
                )}
              </div>
            </div>
          ))}
          <Pagination
            defaultCurrent={1}
            total={total}
            className="flex items-end justify-end"
            style={{ margin: '40px 0' }}
          />
        </div>
        <EnquiryHallDrawer
          params={params}
          onCancel={() => setParams({ visible: false, detailId: null })}
          onOk={onConfirm}
        />
      </div>
    </>
  )
}

export default EnquiryHall
