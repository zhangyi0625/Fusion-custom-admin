import styles from './enquiryHall.module.scss'
import { useEffect, useRef, useState } from 'react'
import { FilterOptions } from './config'
import { DownOutlined } from '@ant-design/icons'
import { Button, Cascader, CascaderProps } from 'antd'
import type {
  EnquiryHallItemParams,
  EnquiryHallItemType,
} from '@/services/enquiryHall/enquiryHallModel'
import EnquiryHallDrawer from './EnquiryHallDrawer'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const EnquiryHall: React.FC = () => {
  const [searchDefaultForm, setSearchDefaultForm] =
    useState<EnquiryHallItemParams>({
      filter: null,
    })

  const [enquiryHallList, setEnquiryHallList] = useState<EnquiryHallItemType[]>(
    [
      {
        id: '',
      },
    ]
  )

  const [params, setParams] = useState<{
    visible: boolean
    detailId: string | null
  }>({
    visible: false,
    detailId: null,
  })
  useEffect(() => {
    init()
  }, [searchDefaultForm])

  const init = () => {
    console.log('初始化加载数据....')
  }

  const onChange: CascaderProps<Option>['onChange'] = (value) => {
    console.log(value)
  }

  const onConfirm = () => {}
  return (
    <>
      <div className={styles['enquiry-hall']}>
        <div className={styles['enquiry-hall-bg']}></div>
        <div className={styles['enquiry-hall-content']}>
          <div className={styles['enquiry-hall-filter']}>
            {FilterOptions.map((item) => (
              <div
                className={`px-[16px] py-[6px] bg-gray-100 rounded-[4px] mr-[8px] text-${
                  searchDefaultForm.filter === item.value ? 'blue' : 'gray'
                }-500`}
                key={item.title}
                onClick={() =>
                  setSearchDefaultForm({
                    ...searchDefaultForm,
                    filter: item.value,
                  })
                }
              >
                {item.title}
              </div>
            ))}
            <Cascader
              placeholder="区域"
              // style={{ background: '#F5F5F5' }}
              options={[]}
              onChange={onChange}
            />
          </div>
          {enquiryHallList.map((item, index) => (
            <div className={styles['enquiry-hall-item']} key={index}>
              <div className="flex items-center">
                <p className="font-semibold text-lg">这里是询价的标题</p>
                <p className="ml-[20px] text-gray-400">2025-08-22发布</p>
              </div>
              <div className="flex items-center mt-[11px] justify-between">
                <div className="flex items-center text-stone-900">
                  <p>城市/区县：宁波海曙区</p>
                  <p className="ml-[20px]">截止报价日期：2025-08-22</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-400 mr-[110px]">
                    预估金额
                    <span className="text-red-500 ml-[4px] font-semibold">
                      8888
                    </span>
                  </p>
                  {searchDefaultForm.filter ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() =>
                        setParams({ visible: true, detailId: item.id })
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
              <div className="text-blue-500 mt-[12px]">
                询价清单
                <DownOutlined
                  style={{ width: '10px', height: '10px', marginLeft: '4px' }}
                />
              </div>
            </div>
          ))}
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
